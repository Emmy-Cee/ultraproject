import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongodb'
import Cart from '../../../models/Cart'
import Product from '../../../models/Product'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/nextAuth'
import { requireAuth } from '../../../lib/authHelpers'

export async function GET() {
  const session = await getServerSession(authOptions)
  const unauthorized = requireAuth(session)
  if (unauthorized) return unauthorized

  await connectToDatabase()
  const cart = await Cart.findOne({ user: session!.user.id }).populate('items.product').lean()
  if (!cart) {
    return NextResponse.json({ cart: { items: [], total: 0 } })
  }

  const items = cart.items.map((item) => ({
    ...item,
    product: { ...item.product, id: String(item.product._id) },
  }))

  const total = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0)
  return NextResponse.json({ cart: { items, total } })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const unauthorized = requireAuth(session)
  if (unauthorized) return unauthorized

  const body = await request.json()
  const { productId, quantity = 1 } = body
  if (!productId || quantity < 1) {
    return NextResponse.json({ error: 'Product ID and quantity are required.' }, { status: 400 })
  }

  await connectToDatabase()
  const product = await Product.findById(productId)
  if (!product) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 })
  }

  let cart = await Cart.findOne({ user: session!.user.id })
  if (!cart) {
    cart = await Cart.create({ user: session!.user.id, items: [{ product: product._id, quantity }] })
  } else {
    const existing = cart.items.find((item) => item.product.toString() === productId)
    if (existing) {
      existing.quantity += quantity
    } else {
      cart.items.push({ product: product._id, quantity })
    }
    await cart.save()
  }

  return NextResponse.json({ cart })
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  const unauthorized = requireAuth(session)
  if (unauthorized) return unauthorized

  const body = await request.json()
  const { productId, quantity } = body
  if (!productId || quantity === undefined || quantity < 0) {
    return NextResponse.json({ error: 'Product ID and valid quantity are required.' }, { status: 400 })
  }

  await connectToDatabase()
  const cart = await Cart.findOne({ user: session!.user.id })
  if (!cart) {
    return NextResponse.json({ error: 'Cart not found.' }, { status: 404 })
  }

  const item = cart.items.find((item) => item.product.toString() === productId)
  if (!item) {
    return NextResponse.json({ error: 'Item not found in cart.' }, { status: 404 })
  }

  if (quantity === 0) {
    cart.items = cart.items.filter((item) => item.product.toString() !== productId)
  } else {
    item.quantity = quantity
  }

  await cart.save()
  return NextResponse.json({ cart })
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  const unauthorized = requireAuth(session)
  if (unauthorized) return unauthorized

  const body = await request.json().catch(() => ({}))
  const productId = body?.productId

  await connectToDatabase()
  const cart = await Cart.findOne({ user: session!.user.id })
  if (!cart) {
    return NextResponse.json({ error: 'Cart not found.' }, { status: 404 })
  }

  if (productId) {
    cart.items = cart.items.filter((item) => item.product.toString() !== productId)
    await cart.save()
    return NextResponse.json({ cart })
  }

  await cart.deleteOne()
  return NextResponse.json({ cart: { items: [], total: 0 } })
}
