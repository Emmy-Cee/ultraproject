const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

if (!PAYSTACK_SECRET_KEY) {
  throw new Error('PAYSTACK_SECRET_KEY environment variable is not defined')
}

const BASE_URL = 'https://api.paystack.co'

export async function initializePayment(options: {
  email: string
  amount: number
  callbackUrl: string
}) {
  const response = await fetch(`${BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: options.email,
      amount: options.amount,
      callback_url: options.callbackUrl,
    }),
  })

  const data = await response.json()
  if (!response.ok || !data.status) {
    throw new Error(data.message || 'Paystack initialization failed')
  }

  return data.data
}

export async function verifyPayment(reference: string) {
  const response = await fetch(`${BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  })

  const data = await response.json()
  if (!response.ok || !data.status) {
    throw new Error(data.message || 'Paystack verification failed')
  }

  return data.data
}
