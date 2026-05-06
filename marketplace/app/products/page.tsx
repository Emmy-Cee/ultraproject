import { connectToDatabase } from '../../lib/mongodb'
import Product from '../../models/Product'
import ProductCard from '../../components/ProductCard'

export default async function ProductsPage() {
  await connectToDatabase()
  const products = await Product.find().populate('vendor', 'name').lean()

  return (
    <main className="page-shell">
      <section className="list-header">
        <h1>Products</h1>
        <p>Shop from our catalog of vendor listings.</p>
      </section>
      <section className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product._id.toString()}
            id={product._id.toString()}
            title={product.title}
            description={product.description}
            price={product.price}
            image={product.image}
            vendorName={product.vendor?.name}
          />
        ))}
      </section>
    </main>
  )
}
