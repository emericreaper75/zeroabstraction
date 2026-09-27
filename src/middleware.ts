import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Extract token from payload's default cookie name
  const token = request.cookies.get('payload-token')?.value
  // NOTE: Do NOT log cookie headers or token values here — they contain auth secrets
  let isAuthenticated = false

  if (token) {
    try {
      const serverURL = request.nextUrl.origin
      const response = await fetch(`${serverURL}/api/users/me`, {
        headers: {
          cookie: `payload-token=${token}`,
          'Authorization': `JWT ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        if (data && data.user) {
          isAuthenticated = true
        }
      }
      // Do not log response body — may contain user PII
    } catch (error) {
      // Auth check failed; treat as unauthenticated
      isAuthenticated = false
    }
  }

  // Handle /login route
  if (pathname === '/login') {
    if (isAuthenticated) {
      // If already logged in, redirect to the dashboard
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.next()
  }

  // Handle /admin/* routes
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      // If not logged in, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*', '/login'],
}
