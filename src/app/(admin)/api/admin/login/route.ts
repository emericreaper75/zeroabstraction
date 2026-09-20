import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  const res = await fetch(`${serverURL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  const response = NextResponse.json(data, { status: res.status })

  // Forward set-cookie headers from Payload
  const setCookie = res.headers.get('set-cookie')
  if (setCookie) {
    response.headers.set('set-cookie', setCookie)
  }

  return response
}
