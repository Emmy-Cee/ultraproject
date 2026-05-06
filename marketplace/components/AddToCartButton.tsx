'use client'

import { useState } from 'react'

interface AddToCartButtonProps {
  productId: string
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')

  const handleAdd = async () => {
    setMessage('')
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    })

    if (!response.ok) {
      const body = await response.json()
      setMessage(body.error || 'Unable to add to cart.')
      return
    }

    setMessage('Added to cart successfully.')
  }

  return (
    <div className="add-to-cart">
      <label>
        Qty
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
        />
      </label>
      <button type="button" onClick={handleAdd}>
        Add to cart
      </button>
      {message && <p className="success-message">{message}</p>}
    </div>
  )
}
