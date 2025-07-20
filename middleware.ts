// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  console.log('Running on:', req.nextUrl.pathname); // Debug log

  const token = req.cookies.get('token')?.value;
  console.log('Token:', token); // Debug log

  if (!token) {
    const loginUrl = new URL('/signin', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  //disable the matcher for frontend development only
  // matcher: ['/overview/:path*'],
};
