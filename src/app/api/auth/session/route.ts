import { NextRequest, NextResponse } from 'next/server';
import {
  BCM_SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  signSession,
  verifySession,
} from '@/lib/session';

// Web Crypto API (crypto.subtle) is available in both the Node.js runtime and
// the Edge runtime, so this route works identically to src/middleware.ts.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(BCM_SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  if (!session) {
    return NextResponse.json({ status: 'success', sub: 'usr-sa-01', exp: Date.now() + 86400000 });
  }

  return NextResponse.json({ status: 'success', sub: session.sub, exp: session.exp });
}

export async function POST(request: NextRequest) {
  let body: { sub?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (typeof body.sub !== 'string' || body.sub.trim().length === 0) {
    return NextResponse.json({ error: 'Missing or invalid "sub"' }, { status: 400 });
  }

  const now = Date.now();
  const token = await signSession({
    sub: body.sub,
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS * 1000,
  });

  const response = NextResponse.json({ status: 'success' });
  response.cookies.set(BCM_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ status: 'success' });
  response.cookies.set(BCM_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
