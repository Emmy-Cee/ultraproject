'use client'

import { useState } from 'react'

interface Product {
  _id: string
  title: string
  description: string
  price: number
  image: string
  category: string
  inStock: boolean
}

interface ProductManagerProps {
  products: Product[]
}

export default function ProductManager({ products }: ProductManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Product>>({})
  const [message, setMessage] = useState('')

  const startEdit = (product: Product) => {
    setEditingId(product._id)
    setEditData(product)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditData({})
  }

  const saveEdit = async () => {
    if (!editingId) return
    setMessage('')

    const response = await fetch(`/api/products/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    })

    const data = await response.json()
    if (!response.ok) {
      setMessage(data.error || 'Unable to update product.')
      return
    }

    setMessage('Product updated successfully.')
    setEditingId(null)
    setEditData({})
    window.location.reload() // Simple refresh for now
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    setMessage('')

    const response = await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const data = await response.json()
      setMessage(data.error || 'Unable to delete product.')
      return
    }

    setMessage('Product deleted successfully.')
    window.location.reload()
  }

  return (
    <div className="product-manager">
      <h2>Your products</h2>
      {products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        products.map((product) => (
          <article key={product._id} className="product-card">
            {editingId === product._id ? (
              <div className="edit-form">
                <label>
                  Title
                  <input
                    value={editData.title || ''}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  />
                </label>
                <label>
                  Description
                  <textarea
                    value={editData.description || ''}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  />
                </label>
                <label>
                  Price
                  <input
                    type="number"
                    value={editData.price || 0}
                    onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })}
                  />
                </label>
                <label>
                  Image URL
                  <input
                    value={editData.image || ''}
                    onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                  />
                </label>
                <label>
                  Category
                  <input
                    value={editData.category || ''}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                  />
                </label>
                <label>
                  In Stock
                  <input
                    type="checkbox"
                    checked={editData.inStock ?? true}
                    onChange={(e) => setEditData({ ...editData, inStock: e.target.checked })}
                  />
                </label>
                <div className="edit-actions">
                  <button onClick={saveEdit}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <p>${product.price.toFixed(2)}</p>
                <div className="product-actions">
                  <button onClick={() => startEdit(product)}>Edit</button>
                  <button onClick={() => deleteProduct(product._id)}>Delete</button>
                </div>
              </div>
            )}
          </article>
        ))
      )}
      {message && <p className="success-message">{message}</p>}
    </div>
  )
}
