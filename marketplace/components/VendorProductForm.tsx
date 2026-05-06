'use client'

import { useState } from 'react'

export default function VendorProductForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState('general')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)

  const uploadImage = async (file: File) => {
    setUploading(true)
    const reader = new FileReader()
    return new Promise<string>((resolve, reject) => {
      reader.onload = async () => {
        try {
          const response = await fetch('/api/uploads/image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageData: reader.result }),
          })
          const data = await response.json()
          if (!response.ok) {
            reject(data.error || 'Image upload failed.')
            return
          }
          resolve(data.url)
        } catch (error) {
          reject((error as Error).message)
        }
      }
      reader.onerror = () => reject('Failed to read image file.')
      reader.readAsDataURL(file)
    }).finally(() => setUploading(false))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')

    let image = imageUrl
    if (!image && imageFile) {
      try {
        image = await uploadImage(imageFile)
      } catch (error) {
        setMessage((error as string) || 'Unable to upload image.')
        return
      }
    }

    if (!image) {
      setMessage('Please provide an image URL or upload a file.')
      return
    }

    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, price: Number(price), image, category }),
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
    setImageFile(null)
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
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
      </label>
      <label>
        Or upload image
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
        />
      </label>
      <label>
        Category
        <input value={category} onChange={(e) => setCategory(e.target.value)} />
      </label>
      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Create product'}
      </button>
      {message && <p className="success-message">{message}</p>}
    </form>
  )
}
