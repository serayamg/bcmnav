// Signed session cookie helper.
//
// Uses the standard Web Crypto API (`crypto.subtle`) exclusively — NOT the
// Node-only `crypto` module (`createHmac`) — because this module is imported
// by both `src/middleware.ts` (Edge Runtime) and Node-based API routes.
// Web Crypto is available in both runtimes, so the exact same code path signs
// and verifies tokens consistently regardless of where it executes.
//
// Token format: base64url(JSON payload) + "." + base64url(HMAC-SHA256 signature)

export const BCM_SESSION_COOKIE = 'bcm_session';

export interface SessionPayload {
  sub: string;
  iat: number;
  exp: number;
}

function getSecret(): string {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret || secret.trim().length === 0) {
    throw new Error(
      'AUTH_SESSION_SECRET is not set. Define it in .env.local (never commit the real value) ' +
        'before signing or verifying session cookies.'
    );
  }
  return secret;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function stringToBytes(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

// TypeScript's lib.dom.d.ts types Uint8Array as generic over its backing
// ArrayBufferLike, which newer TS versions no longer widen automatically to
// the plain `BufferSource` that crypto.subtle expects. Cast explicitly here
// rather than loosening types elsewhere.
function asBufferSource(bytes: Uint8Array): BufferSource {
  return bytes as unknown as BufferSource;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    asBufferSource(stringToBytes(secret)),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function hmacSign(secret: string, data: string): Promise<string> {
  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, asBufferSource(stringToBytes(data)));
  return bytesToBase64Url(new Uint8Array(signature));
}

/**
 * Sign a session payload and return an opaque token suitable for storing in a cookie.
 */
export async function signSession(payload: SessionPayload): Promise<string> {
  const secret = getSecret();
  const payloadJson = JSON.stringify(payload);
  const encodedPayload = bytesToBase64Url(stringToBytes(payloadJson));
  const signature = await hmacSign(secret, encodedPayload);
  return `${encodedPayload}.${signature}`;
}

/**
 * Verify a session token's signature and expiry. Returns the decoded payload
 * when valid, or `null` when the token is missing, malformed, tampered with,
 * or expired.
 */
export async function verifySession(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encodedPayload, signature] = parts;
  if (!encodedPayload || !signature) return null;

  let secret: string;
  try {
    secret = getSecret();
  } catch {
    return null;
  }

  const expectedSignature = await hmacSign(secret, encodedPayload);
  if (!timingSafeEqual(expectedSignature, signature)) {
    return null;
  }

  let payload: SessionPayload;
  try {
    const payloadJson = new TextDecoder().decode(base64UrlToBytes(encodedPayload));
    payload = JSON.parse(payloadJson);
  } catch {
    return null;
  }

  if (
    typeof payload.sub !== 'string' ||
    typeof payload.iat !== 'number' ||
    typeof payload.exp !== 'number'
  ) {
    return null;
  }

  if (Date.now() >= payload.exp) {
    return null;
  }

  return payload;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/** Session lifetime in seconds (8 hours). */
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;
