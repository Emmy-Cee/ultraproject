'use client'

import { useState } from 'react'

interface CartProduct {
  _id: string
  title: string
  price: number
  image: string
}

interface CartItem {
  product: CartProduct
  quantity: number
}

interface CartActionsProps {
  items: CartItem[]
}

export default function CartActions({ items }: CartActionsProps) {
  const [message, setMessage] = useState('')
  const [cartItems, setCartItems] = useState(items)

  const updateQuantity = async (productId: string, quantity: number) => {
    setMessage('')
    const response = await fetch('/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    })
    const data = await response.json()
    if (!response.ok) {
      setMessage(data.error || 'Unable to update quantity')
      return
    }
    setCartItems(data.cart.items)
    setMessage('Cart updated successfully.')
  }

  const removeItem = async (productId: string) => {
    setMessage('')
    const response = await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    })
    const data = await response.json()
    if (!response.ok) {
      setMessage(data.error || 'Unable to remove item')
      return
    }
    setCartItems(data.cart.items)
    setMessage('Item removed.')
  }

  return (
    <div className="cart-actions">
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item.product._id} className="cart-item-row">
            <span>{item.product.title}</span>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(event) => updateQuantity(item.product._id, Number(event.target.value))}
            />
            <button type="button" onClick={() => removeItem(item.product._id)}>
              Remove
            </button>
          </div>
        ))
      )}
      {message && <p className="success-message">{message}</p>}
    </div>
  )
}
