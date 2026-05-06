import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongodb'
import Order from '../../../models/Order'
import Cart from '../../../models/Cart'
import Product from '../../../models/Product'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/nextAuth'
import { requireAuth, requireRole } from '../../../lib/authHelpers'

export async function GET() {
  const session = await getServerSession(authOptions)
  const unauthorized = requireAuth(session)
  if (unauthorized) return unauthorized

  await connectToDatabase()
  const filters = session!.user.role === 'admin' ? {} : { user: session!.user.id }
  const orders = await Order.find(filters).populate('products.product').populate('user', 'name email').lean()
  return NextResponse.json({ orders })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const unauthorized = requireAuth(session)
  if (unauthorized) return unauthorized

  await connectToDatabase()
  const cart = await Cart.findOne({ user: session!.user.id }).populate('items.product')
  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 })
  }

  const items = cart.items.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
  }))

  const total = cart.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0)

  const order = await Order.create({
    user: session!.user.id,
    products: items,
    total,
    status: 'pending',
  })

  await cart.deleteOne()
  return NextResponse.json({ order }, { status: 201 })
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  const unauthorized = requireAuth(session) || requireRole(session, ['admin'])
  if (unauthorized) return unauthorized

  const body = await request.json()
  const { orderId, status } = body
  if (!orderId || !['pending', 'paid', 'shipped', 'delivered'].includes(status)) {
    return NextResponse.json({ error: 'Order ID and valid status are required.' }, { status: 400 })
  }

  const order = await Order.findById(orderId)
  if (!order) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
  }

  order.status = status as typeof order.status
  await order.save()
  return NextResponse.json({ order })
}
