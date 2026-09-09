import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { BCM_SESSION_COOKIE, verifySession } from '@/lib/session';
import { SecureLoginPortal } from '@/components/security/SecureLoginPortal';

// Server component: the session cookie (HttpOnly, HMAC-signed) is verified
// here before anything is rendered. A visitor with a valid session is sent
// straight to the dashboard; everyone else sees the real login form —
// there is no client-side-only bypass path anymore.
export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(BCM_SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  if (session) {
    redirect('/dashboard');
  }

  return <SecureLoginPortal />;
}

