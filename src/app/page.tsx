import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { BCM_SESSION_COOKIE, verifySession } from '@/lib/session';

export default async function RootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(BCM_SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  redirect(session ? '/dashboard' : '/login');
}
