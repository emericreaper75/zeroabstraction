import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Extract token from payload's default cookie name
  const token = request.cookies.get('payload-token')?.value
  console.log('MIDDLEWARE COOKIE HEADER:', request.headers.get('cookie'))
  console.log('MIDDLEWARE TOKEN:', token)
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
      console.log('MIDDLEWARE FETCH STATUS:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('MIDDLEWARE FETCH DATA:', data)
        if (data && data.user) {
          isAuthenticated = true
        }
      } else {
        console.log('MIDDLEWARE FETCH FAILED TEXT:', await response.text())
      }
    } catch (error) {
      console.log('MIDDLEWARE AUTH FETCH ERROR:', error)
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
