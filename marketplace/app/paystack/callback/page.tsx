import { connectToDatabase } from '../../../../lib/mongodb'
import { verifyPayment } from '../../../../lib/paystack'
import Order from '../../../../models/Order'
import { redirect } from 'next/navigation'

interface CallbackPageProps {
  searchParams: { reference?: string; orderId?: string }
}

export default async function CallbackPage({ searchParams }: CallbackPageProps) {
  const { reference, orderId } = searchParams
  if (!reference || !orderId) {
    return <p>Missing payment reference or order ID.</p>
  }

  await connectToDatabase()
  const order = await Order.findById(orderId)
  if (!order) {
    return <p>Order not found.</p>
  }

  try {
    const paymentResult = await verifyPayment(reference)
    if (paymentResult.status === 'success') {
      order.status = 'paid'
      order.paymentReference = reference
      await order.save()
      redirect('/orders')
    }

    return <p>Payment verification failed.</p>
  } catch (error) {
    return <p>Payment verification error: {(error as Error).message}</p>
  }
}
