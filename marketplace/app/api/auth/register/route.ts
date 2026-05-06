import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../lib/mongodb'
import User from '../../../../models/User'
import { hashPassword } from '../../../../lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, role } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 })
    }

    await connectToDatabase()
    const normalizedEmail = email.toLowerCase()
    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered.' }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: role || 'user',
    })

    return NextResponse.json({ user: { id: user._id.toString(), email: user.email, role: user.role } }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Unable to register user.', details: (error as Error).message },
      { status: 500 }
    )
  }
}
