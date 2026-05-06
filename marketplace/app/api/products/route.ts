import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongodb'
import Product from '../../../models/Product'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/nextAuth'
import { requireRole, requireAuth } from '../../../lib/authHelpers'

export async function GET(request: Request) {
  await connectToDatabase()

  const url = new URL(request.url)
  const title = url.searchParams.get('title') ?? undefined
  const category = url.searchParams.get('category') ?? undefined
  const vendor = url.searchParams.get('vendor') ?? undefined
  const minPrice = Number(url.searchParams.get('minPrice'))
  const maxPrice = Number(url.searchParams.get('maxPrice'))
  const inStock = url.searchParams.get('inStock')

  const filter: Record<string, any> = {}
  if (title) filter.title = { $regex: title, $options: 'i' }
  if (category) filter.category = category
  if (vendor) filter.vendor = vendor
  if (!Number.isNaN(minPrice)) filter.price = { ...filter.price, $gte: minPrice }
  if (!Number.isNaN(maxPrice)) filter.price = { ...filter.price, $lte: maxPrice }
  if (inStock === 'true') filter.inStock = true
  if (inStock === 'false') filter.inStock = false

  const products = await Product.find(filter).populate('vendor', 'name email role').lean()
  return NextResponse.json({ products })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const unauthorized = requireAuth(session) || requireRole(session, ['vendor', 'admin'])
  if (unauthorized) return unauthorized

  const body = await request.json()
  const { title, description, price, image, category, inStock } = body

  if (!title || !description || !price || !image) {
    return NextResponse.json({ error: 'Missing required product fields.' }, { status: 400 })
  }

  await connectToDatabase()
  const product = await Product.create({
    title,
    description,
    price,
    image,
    category: category || 'general',
    inStock: typeof inStock === 'boolean' ? inStock : true,
    vendor: session!.user.id,
  })

  return NextResponse.json({ product }, { status: 201 })
}
