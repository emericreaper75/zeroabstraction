import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const cookieHeader = request.headers.get('cookie') || ''
  const targetParam = request.nextUrl.searchParams.get('redirect')
  const safeRedirect =
    targetParam && targetParam.startsWith('/') && !targetParam.startsWith('//')
      ? targetParam
      : '/login'

  const redirectUrl = new URL(safeRedirect, request.url)
  const response = NextResponse.redirect(redirectUrl, { status: 303 })

  try {
    const res = await fetch(`${serverURL}/api/users/logout`, {
      method: 'POST',
      headers: {
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
    })
    const setCookie = res.headers.get('set-cookie')
    if (setCookie) {
      response.headers.set('set-cookie', setCookie)
    }
  } catch {
    // Fallback: expire payload-token cookie directly if internal fetch fails
    response.cookies.set('payload-token', '', { path: '/', maxAge: 0 })
  }

  return response
}
