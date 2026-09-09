import { NextRequest, NextResponse } from 'next/server';
import { BCM_SESSION_COOKIE, verifySession } from '@/lib/session';

// Server-side enforcement of the session gate. This runs on the Edge Runtime
// for every matched request, BEFORE any page or API route handler executes,
// so it cannot be bypassed by manipulating client-side React state.
//
// NOTE: the redirect decisions for '/' and '/login' are made HERE rather
// than left solely to their respective page.tsx server components. Those
// pages are rendered as `children` of a Client Component (AppShell) that
// conditionally decides whether to use that slot at all — in that
// composition, a `redirect()` thrown deep inside the nested Server Component
// does not reliably surface as a real HTTP redirect. Middleware runs before
// any of that rendering happens, so it is the reliable place to enforce it.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(BCM_SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  if (pathname.startsWith('/api/')) {
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname === '/login') {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL(session ? '/dashboard' : '/login', request.url));
  }

  // All other page routes require a valid session.
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image (Next.js internals)
     * - static assets (favicon, manifest, images, fonts)
     * - /api/auth (session issuance/verification/removal endpoints, which
     *   must remain reachable without an existing session)
     * '/login' and '/' are intentionally NOT excluded — they are handled
     * explicitly above so already-authenticated visitors are bounced away
     * from the login page instead of just falling through to it.
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)',
  ],
};
