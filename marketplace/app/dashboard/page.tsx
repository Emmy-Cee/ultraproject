import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '../../lib/nextAuth'
import { connectToDatabase } from '../../lib/mongodb'
import Order from '../../models/Order'
import Product from '../../models/Product'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Dashboard | UltraProject Marketplace',
  description: 'Secure seller and customer dashboard with personalized order, product, and account insights.',
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  await connectToDatabase()

  const isVendor = ['vendor', 'admin'].includes(session.user.role)
  let productCount = 0
  let orderCount = 0
  let revenue = 0
  let totalSpent = 0

  if (isVendor) {
    const products = await Product.find({ vendor: session.user.id }).lean()
    productCount = products.length
    orderCount = await Order.countDocuments({ 'products.product': { $in: products.map((product) => product._id) } })

    type VendorOrder = {
      products: Array<{ product: { price: number } | null; quantity: number }>
    }

    const orders = await Order.find({ 'products.product': { $in: products.map((product) => product._id) } })
      .populate('products.product', 'price')
      .lean() as VendorOrder[]

    revenue = orders.reduce((sum, order) => {
      return sum +
        order.products.reduce((itemSum, item) => {
          return itemSum + ((item.product?.price ?? 0) * item.quantity)
        }, 0)
    }, 0)
  } else {
    const orders = await Order.find({ user: session.user.id }).lean()
    orderCount = orders.length
    totalSpent = orders.reduce((sum, order) => sum + order.total, 0)
  }

  return (
    <main className="page-shell">
      <section className="dashboard-card">
        <h1>Welcome back, {session.user.name ?? 'user'}</h1>
        <p>Account role: {session.user.role}</p>
        <div className="dashboard-actions">
          <Link href="/products">Browse products</Link>
          <Link href="/orders">View orders</Link>
          <Link href="/login">Sign out</Link>
        </div>
      </section>

      <section className="dashboard-card">
        <h2>Dashboard summary</h2>
        <div className="dashboard-grid">
          <div className="dashboard-stat">
            <h3>Order count</h3>
            <p>{orderCount}</p>
          </div>
          {isVendor ? (
            <>
              <div className="dashboard-stat">
                <h3>Products listed</h3>
                <p>{productCount}</p>
              </div>
              <div className="dashboard-stat">
                <h3>Estimated revenue</h3>
                <p>${revenue.toFixed(2)}</p>
              </div>
            </>
          ) : (
            <div className="dashboard-stat">
              <h3>Total spent</h3>
              <p>${totalSpent.toFixed(2)}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
