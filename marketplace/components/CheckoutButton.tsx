'use client'

import { useState } from 'react'

interface CheckoutButtonProps {
  orderId: string
}

export default function CheckoutButton({ orderId }: CheckoutButtonProps) {
  const [message, setMessage] = useState('')

  const handleCheckout = async () => {
    setMessage('Redirecting to payment...')
    const callbackUrl = `${window.location.origin}/orders`
    const response = await fetch('/api/paystack/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, callbackUrl }),
    })

    if (!response.ok) {
      const body = await response.json()
      setMessage(body.error || 'Unable to initialize payment.')
      return
    }

    const data = await response.json()
    if (data.paymentData?.authorization_url) {
      window.location.href = data.paymentData.authorization_url
    } else {
      setMessage('Payment initialization failed.')
    }
  }

  return (
    <button className="checkout-button" type="button" onClick={handleCheckout}>
      Pay with Paystack
    </button>
  )
}
