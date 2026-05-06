import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongodb'
import Review from '../../../models/Review'
import Product from '../../../models/Product'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/nextAuth'
import { requireAuth } from '../../../lib/authHelpers'

export async function GET(request: Request) {
  await connectToDatabase()
  const url = new URL(request.url)
  const product = url.searchParams.get('product')
  const filters: Record<string, string> = {}
  if (product) filters.product = product

  const reviews = await Review.find(filters).populate('user', 'name').populate('product', 'title').lean()
  return NextResponse.json({ reviews })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const unauthorized = requireAuth(session)
  if (unauthorized) return unauthorized

  const body = await request.json()
  const { productId, rating, comment } = body
  if (!productId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Product ID and valid rating are required.' }, { status: 400 })
  }

  await connectToDatabase()
  const product = await Product.findById(productId)
  if (!product) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 })
  }

  const review = await Review.create({
    user: session!.user.id,
    product: product._id,
    rating,
    comment: comment || '',
  })

  return NextResponse.json({ review }, { status: 201 })
}
