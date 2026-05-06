import { connectToDatabase } from '../lib/mongodb'
import Product from '../models/Product'
import Link from 'next/link'

export default async function HomePage() {
  await connectToDatabase()
  const products = await Product.find().limit(6).lean()

  return (
    <main className="page-shell">
      <section className="hero">
        <h1>UltraProject Marketplace</h1>
        <p>Browse products, manage your cart, and grow your store with vendor and admin dashboards.</p>
        <div className="hero-actions">
          <Link href="/products">Browse products</Link>
          <Link href="/login">Login</Link>
        </div>
      </section>
      <section className="preview-grid">
        {products.map((product) => (
          <article key={product._id.toString()} className="preview-card">
            <img src={product.image} alt={product.title} />
            <div>
              <h2>{product.title}</h2>
              <p>{product.description.slice(0, 100)}...</p>
              <Link href={`/products/${product._id.toString()}`}>View details</Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
