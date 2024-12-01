/* eslint-disable @typescript-eslint/no-explicit-any */

// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//     const loggedIn = request.cookies.get('authToken'); // authToken key ov cookie chka

//     if (!loggedIn) {
//         return NextResponse.redirect(new URL('/login', request.url));
//     } // misht true a linelu

//     return NextResponse.next();
// }

// export const config = {
//     matcher: ['/'], // middlware menak kashxati / routei jamanak
// };


import { NextRequest } from "next/server"
import { auth } from "./auth";
import { apiAuthPrefix, DEFAULT_REDIRECT_URL, PUBLIC_ROUTES } from "./routes";
 
const authMiddleware = auth(req => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

  if (isApiAuthRoute) return;


  if (isPublicRoute) {
    if (isLoggedIn) {
      const redirectUrl = new URL(`${DEFAULT_REDIRECT_URL}`, nextUrl.origin);
      return Response.redirect(redirectUrl);
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL('/login', nextUrl));
  }
});

export default function middleware(req: NextRequest) {
  return (authMiddleware as any)(req);
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};