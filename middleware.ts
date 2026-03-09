// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if token exists in localStorage (Zustand persist)
  // Note: We can't directly access localStorage in middleware
  // So we'll check cookies or use a different approach
  
  const url = request.nextUrl.clone()
  
  // Allow sign-in page
  if (url.pathname.startsWith('/sign-in')) {
    return NextResponse.next()
  }
  
  // For protected routes, let client-side handle auth check
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}