import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/nextAuth'
import { requireAuth, requireRole } from '../../../../lib/authHelpers'
import { uploadImage } from '../../../../lib/cloudinary'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const unauthorized = requireAuth(session) || requireRole(session, ['vendor', 'admin'])
  if (unauthorized) return unauthorized

  const body = await request.json()
  const imageData = body.imageData || body.imageUrl
  if (!imageData) {
    return NextResponse.json({ error: 'Image data or URL is required.' }, { status: 400 })
  }

  const url = await uploadImage(imageData)
  return NextResponse.json({ url })
}
