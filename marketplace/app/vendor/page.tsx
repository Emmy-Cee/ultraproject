import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/nextAuth'
import { redirect } from 'next/navigation'
import { connectToDatabase } from '../../lib/mongodb'
import Product from '../../models/Product'
import Order from '../../models/Order'
import VendorProductForm from '../../components/VendorProductForm'
import ProductManager from '../../components/ProductManager'

export default async function VendorPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/login')
  }

  if (!['vendor', 'admin'].includes(session.user.role)) {
    redirect('/')
  }

  await connectToDatabase()
  const products = await Product.find({ vendor: session.user.id }).lean()
  const orderCount = await Order.countDocuments({ 'products.product': { $in: products.map((item) => item._id) } })
  const orders = await Order.find({ 'products.product': { $in: products.map((item) => item._id) } }).populate('products.product', 'price').lean()
  const revenue = orders.reduce((orderSum, order) => {
    return (
      orderSum +
      order.products.reduce((itemSum, item) => {
        return itemSum + (item.product ? item.quantity * item.product.price : 0)
      }, 0)
    )
  }, 0)

  return (
    <main className="page-shell">
      <section className="dashboard-card">
        <h1>Vendor Dashboard</h1>
        <p>Welcome, {session.user.name ?? 'seller'}</p>
        <div className="dashboard-grid">
          <div className="dashboard-stat">
            <h3>Product count</h3>
            <p>{products.length}</p>
          </div>
          <div className="dashboard-stat">
            <h3>Order count</h3>
            <p>{orderCount}</p>
          </div>
          <div className="dashboard-stat">
            <h3>Sales revenue</h3>
            <p>${revenue.toFixed(2)}</p>
          </div>
        </div>
      </section>
      <section className="dashboard-card">
        <VendorProductForm />
      </section>
      <section className="dashboard-card">
        <ProductManager products={products as any} />
      </section>
    </main>
  )
}

