import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/nextAuth'
import { requireAuth } from '../../../../lib/authHelpers'
import Order from '../../../../models/Order'
import { connectToDatabase } from '../../../../lib/mongodb'
import { initializePayment } from '../../../../lib/paystack'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const unauthorized = requireAuth(session)
  if (unauthorized) return unauthorized

  const body = await request.json()
  const { orderId, callbackUrl } = body
  if (!orderId || !callbackUrl) {
    return NextResponse.json({ error: 'Order ID and callback URL are required.' }, { status: 400 })
  }

  await connectToDatabase()
  const order = await Order.findById(orderId)
  if (!order) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
  }

  if (order.user.toString() !== session!.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const amount = Math.round(order.total * 100)
  const paymentData = await initializePayment({ email: session!.user.email ?? '', amount, callbackUrl })
  return NextResponse.json({ paymentData })
}
