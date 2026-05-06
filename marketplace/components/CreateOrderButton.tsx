'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateOrderButton() {
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleCreateOrder = async () => {
    setMessage('Creating order...')
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await response.json()
    if (!response.ok) {
      setMessage(data.error || 'Unable to create order.')
      return
    }

    setMessage('Order created successfully.')
    router.refresh()
  }

  return (
    <div className="create-order">
      <button type="button" onClick={handleCreateOrder}>
        Create Order
      </button>
      {message && <p>{message}</p>}
    </div>
  )
}
