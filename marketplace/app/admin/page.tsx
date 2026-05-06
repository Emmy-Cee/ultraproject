import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/nextAuth'
import { redirect } from 'next/navigation'
import { connectToDatabase } from '../../lib/mongodb'
import User from '../../models/User'
import Product from '../../models/Product'
import Order from '../../models/Order'
import ProductManager from '../../components/ProductManager'
import AdminUserManager from '../../components/AdminUserManager'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.role !== 'admin') {
    redirect('/')
  }

  await connectToDatabase()
  const users = await User.find().lean()
  const products = await Product.find().lean()
  const orders = await Order.find().lean()

  return (
    <main className="page-shell">
      <section className="dashboard-card">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-grid">
          <div className="dashboard-stat">
            <h3>Users</h3>
            <p>{users.length}</p>
          </div>
          <div className="dashboard-stat">
            <h3>Products</h3>
            <p>{products.length}</p>
          </div>
          <div className="dashboard-stat">
            <h3>Orders</h3>
            <p>{orders.length}</p>
          </div>
        </div>
      </section>
      <section className="dashboard-card">
        <AdminUserManager
          initialUsers={users.map((user) => ({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          }))}
        />
      </section>
      <section className="dashboard-card">
        <h2>Manage products</h2>
        <ProductManager products={products as any} />
      </section>
    </main>
  )
}
