import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  if (pathname.startsWith('/admin')) {
    if (!token?.role || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (pathname.startsWith('/vendor')) {
    if (!token?.role || !['vendor', 'admin'].includes(token.role)) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (pathname === '/dashboard' || pathname.startsWith('/cart') || pathname.startsWith('/orders')) {
    if (!token?.sub) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/vendor/:path*', '/dashboard', '/cart/:path*', '/orders/:path*'],
}
