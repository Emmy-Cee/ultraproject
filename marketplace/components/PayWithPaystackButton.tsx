'use client'

import { useState } from 'react'

interface PayWithPaystackButtonProps {
  orderId: string
}

export default function PayWithPaystackButton({ orderId }: PayWithPaystackButtonProps) {
  const [message, setMessage] = useState('')

  const handlePay = async () => {
    setMessage('Redirecting to Paystack...')
    const callbackUrl = `${window.location.origin}/paystack/callback?orderId=${orderId}`
    const response = await fetch('/api/paystack/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, callbackUrl }),
    })

    const data = await response.json()
    if (!response.ok) {
      setMessage(data.error || 'Unable to initialize payment.')
      return
    }

    if (data.paymentData?.authorization_url) {
      window.location.href = data.paymentData.authorization_url
    } else {
      setMessage('Payment initialization failed.')
    }
  }

  return (
    <button className="checkout-button" type="button" onClick={handlePay}>
      Pay now
    </button>
  )
}
