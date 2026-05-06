'use client'

import { useState } from 'react'

interface ReviewFormProps {
  productId: string
}

export default function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')

    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, rating, comment }),
    })

    const data = await response.json()
    if (!response.ok) {
      setMessage(data.error || 'Unable to submit review.')
      return
    }

    setMessage('Review submitted successfully.')
    setRating(5)
    setComment('')
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Leave a review</h3>
      <label>
        Rating
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </label>
      <label>
        Comment
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} required />
      </label>
      <button type="submit">Submit review</button>
      {message && <p className="success-message">{message}</p>}
    </form>
  )
}
