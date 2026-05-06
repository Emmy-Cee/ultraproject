import { connectToDatabase } from '../../lib/mongodb'
import Cart from '../../models/Cart'
import CartActions from '../../components/CartActions'
import CreateOrderButton from '../../components/CreateOrderButton'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/nextAuth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CartPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/login')
  }

  await connectToDatabase()
  const cart = await Cart.findOne({ user: session.user.id }).populate('items.product').lean()
  const items = cart?.items ?? []
  const total = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0)

  return (
    <main className="page-shell">
      <section className="cart-page">
        <h1>Your Shopping Cart</h1>
        {items.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link href="/marketplace" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              <CartActions items={items as any} />
            </div>
            <div className="cart-summary">
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal ({items.length} items)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <CreateOrderButton />
            </div>
          </>
        )}
      </section>
    </main>
  )
}
