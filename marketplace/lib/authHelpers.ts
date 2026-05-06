import { getServerSession } from 'next-auth'
import { authOptions } from './nextAuth'
import { Session } from 'next-auth'
import { NextResponse } from 'next/server'

export async function getSession() {
  return getServerSession(authOptions)
}

export function requireAuth(session: Session | null) {
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }
  return null
}

export function requireRole(session: Session | null, roles: Array<'user' | 'vendor' | 'admin'>) {
  if (!session?.user?.role || !roles.includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  return null
}
