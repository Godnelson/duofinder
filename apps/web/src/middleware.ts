import { NextResponse, type NextRequest } from 'next/server';

export const PUBLIC_PATHS = ['/', '/login'];

export function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.includes(pathname);
}

export function shouldRedirectToLogin(pathname: string, hasToken: boolean) {
  return !hasToken && !isPublicPath(pathname);
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  if (shouldRedirectToLogin(pathname, Boolean(token))) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
