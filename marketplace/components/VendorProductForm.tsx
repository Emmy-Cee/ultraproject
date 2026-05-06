'use client'

import { useState } from 'react'

export default function VendorProductForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState('general')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')

    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, price: Number(price), image: imageUrl, category }),
    })

    const data = await response.json()
    if (!response.ok) {
      setMessage(data.error || 'Unable to create product')
      return
    }

    setMessage('Product created successfully.')
    setTitle('')
    setDescription('')
    setPrice('')
    setImageUrl('')
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>Add a new product</h2>
      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        Description
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </label>
      <label>
        Price
        <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" step="0.01" required />
      </label>
      <label>
        Image URL
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
      </label>
      <label>
        Category
        <input value={category} onChange={(e) => setCategory(e.target.value)} />
      </label>
      <button type="submit">Create product</button>
      {message && <p className="success-message">{message}</p>}
    </form>
  )
}
