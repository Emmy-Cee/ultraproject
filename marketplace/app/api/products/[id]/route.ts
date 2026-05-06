import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../lib/mongodb'
import Product from '../../../../models/Product'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/nextAuth'
import { requireRole, requireAuth } from '../../../../lib/authHelpers'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  await connectToDatabase()
  const product = await Product.findById(params.id).populate('vendor', 'name email role').lean()

  if (!product) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 })
  }

  return NextResponse.json({ product })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const unauthorized = requireAuth(session) || requireRole(session, ['vendor', 'admin'])
  if (unauthorized) return unauthorized

  const body = await request.json()
  await connectToDatabase()

  const product = await Product.findById(params.id)
  if (!product) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 })
  }

  if (session!.user.role !== 'admin' && product.vendor.toString() !== session!.user.id) {
    return NextResponse.json({ error: 'Unauthorized to update this product.' }, { status: 403 })
  }

  const updates = {
    title: body.title ?? product.title,
    description: body.description ?? product.description,
    price: body.price ?? product.price,
    image: body.image ?? product.image,
    category: body.category ?? product.category,
    inStock: typeof body.inStock === 'boolean' ? body.inStock : product.inStock,
  }

  Object.assign(product, updates)
  await product.save()

  return NextResponse.json({ product })
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const unauthorized = requireAuth(session) || requireRole(session, ['vendor', 'admin'])
  if (unauthorized) return unauthorized

  await connectToDatabase()

  const product = await Product.findById(params.id)
  if (!product) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 })
  }

  if (session!.user.role !== 'admin' && product.vendor.toString() !== session!.user.id) {
    return NextResponse.json({ error: 'Unauthorized to delete this product.' }, { status: 403 })
  }

  await product.deleteOne()
  return NextResponse.json({ success: true })
}
