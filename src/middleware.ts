import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/profile(.*)']);
const validProfilePaths = ['/profile/contacts'];

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();

  // redirect user to profile from unexisting profile route
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/profile/')) {
    if (!validProfilePaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/profile', req.url));
    }
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
