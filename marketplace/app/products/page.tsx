import { connectToDatabase } from '../../lib/mongodb'
import Product from '../../models/Product'
import ProductFilter from '../../components/ProductFilter'

export default async function ProductsPage() {
  await connectToDatabase()
  const products = await Product.find().populate('vendor', 'name').lean()

  return (
    <main className="page-shell">
      <ProductFilter initialProducts={products as any} />
    </main>
  )
}
