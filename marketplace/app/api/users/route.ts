import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongodb'
import User from '../../../models/User'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/nextAuth'
import { requireRole, requireAuth } from '../../../lib/authHelpers'

export async function GET() {
  const session = await getServerSession(authOptions)
  const unauthorized = requireAuth(session) || requireRole(session, ['admin'])
  if (unauthorized) return unauthorized

  await connectToDatabase()
  const users = await User.find({}, 'name email role createdAt').lean()
  return NextResponse.json({ users })
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  const unauthorized = requireAuth(session) || requireRole(session, ['admin'])
  if (unauthorized) return unauthorized

  const body = await request.json()
  const { userId, role } = body
  if (!userId || !['user', 'vendor', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'Valid user ID and role are required.' }, { status: 400 })
  }

  await connectToDatabase()
  const user = await User.findById(userId)
  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 })
  }

  user.role = role
  await user.save()
  return NextResponse.json({ user })
}
