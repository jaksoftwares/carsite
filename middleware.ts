import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Basic middleware - can be extended for auth, redirects, etc.
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// Match all paths except static files, api routes, etc.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
