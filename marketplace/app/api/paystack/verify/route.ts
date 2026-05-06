import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/nextAuth'
import { requireAuth } from '../../../../lib/authHelpers'
import Order from '../../../../models/Order'
import { connectToDatabase } from '../../../../lib/mongodb'
import { verifyPayment } from '../../../../lib/paystack'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const unauthorized = requireAuth(session)
  if (unauthorized) return unauthorized

  const body = await request.json()
  const { orderId, reference } = body
  if (!orderId || !reference) {
    return NextResponse.json({ error: 'Order ID and reference are required.' }, { status: 400 })
  }

  await connectToDatabase()
  const order = await Order.findById(orderId)
  if (!order) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
  }

  if (order.user.toString() !== session!.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const paymentResult = await verifyPayment(reference)
  if (paymentResult.status !== 'success') {
    return NextResponse.json({ error: 'Payment verification failed.' }, { status: 400 })
  }

  order.status = 'paid'
  order.paymentReference = reference
  await order.save()

  return NextResponse.json({ order, paymentResult })
}
