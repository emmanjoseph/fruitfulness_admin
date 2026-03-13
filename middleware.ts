// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value
  const { pathname } = request.nextUrl


  const isSignInPage = pathname === '/sign-in'

  if (!token && !isSignInPage) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  if (token && isSignInPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',],
}