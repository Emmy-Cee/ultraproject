import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongodb'

export async function GET() {
  try {
    await connectToDatabase()
    return NextResponse.json({ status: 'ok', message: 'Connected to MongoDB' })
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'MongoDB connection failed', details: (error as Error).message },
      { status: 500 }
    )
  }
}
