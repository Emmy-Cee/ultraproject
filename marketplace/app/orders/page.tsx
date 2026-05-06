import { connectToDatabase } from '../../lib/mongodb'
import Order from '../../models/Order'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/nextAuth'
import { redirect } from 'next/navigation'
import PayWithPaystackButton from '../../components/PayWithPaystackButton'

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/login')
  }

  await connectToDatabase()
  const orders = await Order.find(
    session.user.role === 'admin' ? {} : { user: session.user.id }
  )
    .populate('products.product', 'title price')
    .lean()

  return (
    <main className="page-shell">
      <section className="orders-page">
        <h1>Order History</h1>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <article key={order._id.toString()} className="order-card">
              <h2>Order {order._id.toString()}</h2>
              <p>Status: {order.status}</p>
              <p>Total: ${order.total.toFixed(2)}</p>
              <p>Placed: {new Date(order.createdAt).toLocaleDateString()}</p>
              <ul>
                {order.products.map((item) => (
                  <li key={item.product._id.toString()}>
                    {item.product.title} x {item.quantity} = ${item.quantity * item.product.price}
                  </li>
                ))}
              </ul>
              {order.status === 'pending' && <PayWithPaystackButton orderId={order._id.toString()} />}
            </article>
          ))
        )}
      </section>
    </main>
  )
}
