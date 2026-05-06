import { connectToDatabase } from '../../lib/mongodb'
import Cart from '../../models/Cart'
import CartActions from '../../components/CartActions'
import CreateOrderButton from '../../components/CreateOrderButton'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/nextAuth'
import { redirect } from 'next/navigation'

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
        <h1>Your Cart</h1>
        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <CartActions items={items as any} />
            <div className="cart-summary">
              <p>Total: ${total.toFixed(2)}</p>
              <CreateOrderButton />
            </div>
          </>
        )}
      </section>
    </main>
  )
}
