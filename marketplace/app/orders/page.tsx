import { connectToDatabase } from '../../lib/mongodb'
import Order from '../../models/Order'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/nextAuth'
import { redirect } from 'next/navigation'
import PayWithPaystackButton from '../../components/PayWithPaystackButton'
import Link from 'next/link'

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'status-pending'
      case 'paid': return 'status-paid'
      case 'shipped': return 'status-shipped'
      case 'delivered': return 'status-delivered'
      case 'cancelled': return 'status-cancelled'
      default: return 'status-default'
    }
  }

  return (
    <main className="page-shell">
      <section className="orders-page">
        <h1>Your Order History</h1>
        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-orders-icon">📦</div>
            <h2>No orders yet</h2>
            <p>You haven't placed any orders yet. Start shopping to see your order history here.</p>
            <Link href="/marketplace" className="btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article key={order._id.toString()} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h2>Order #{order._id.toString().slice(-8)}</h2>
                    <p className="order-date">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className={`order-status ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>

                <div className="order-items">
                  <h3>Items Ordered</h3>
                  <ul className="order-items-list">
                    {order.products.map((item) => (
                      <li key={item.product._id.toString()} className="order-item">
                        <span className="item-name">{item.product.title}</span>
                        <span className="item-quantity">x{item.quantity}</span>
                        <span className="item-price">${(item.quantity * item.product.price).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total: </span>
                    <span className="total-amount">${order.total.toFixed(2)}</span>
                  </div>
                  {order.status === 'pending' && (
                    <div className="order-actions">
                      <PayWithPaystackButton orderId={order._id.toString()} />
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
