import { NextRequest, NextResponse } from "next/server";
export { default } from 'next-auth/middleware'
import { getToken } from "next-auth/jwt";

export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ],
}
// console.log("middleware.ts")
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;
    // console.log(url.pathname)
    // console.log(token)

    // Redirect to dashboard if the user is already authenticated and trying to access sign-in, sign-up, or home page

    if (
    token &&
    (url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname === '/')
    ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
}
