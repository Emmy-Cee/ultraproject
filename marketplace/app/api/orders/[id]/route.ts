import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../../lib/mongodb'
import Order from '../../../../../models/Order'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../lib/nextAuth'
import { requireAuth } from '../../../../../lib/authHelpers'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const unauthorized = requireAuth(session)
  if (unauthorized) return unauthorized

  await connectToDatabase()
  const order = await Order.findById(params.id).populate('products.product').lean()
  if (!order) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
  }

  if (session!.user.role !== 'admin' && order.user.toString() !== session!.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  return NextResponse.json({ order })
}
