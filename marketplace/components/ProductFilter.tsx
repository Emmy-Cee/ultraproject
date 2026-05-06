'use client'

import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'

interface Product {
  _id: string
  title: string
  description: string
  price: number
  image: string
  vendor?: { name?: string }
}

interface ProductFilterProps {
  initialProducts: Product[]
}

export default function ProductFilter({ initialProducts }: ProductFilterProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [inStock, setInStock] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setProducts(initialProducts)
  }, [initialProducts])

  const fetchProducts = async () => {
    setLoading(true)
    setError('')

    const params = new URLSearchParams()
    if (title) params.append('title', title)
    if (category) params.append('category', category)
    if (minPrice) params.append('minPrice', minPrice)
    if (maxPrice) params.append('maxPrice', maxPrice)
    if (inStock) params.append('inStock', inStock)

    try {
      const response = await fetch(`/api/products?${params.toString()}`)
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Unable to fetch products.')
      } else {
        setProducts(data.products)
      }
    } catch (err) {
      setError('Unable to fetch products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await fetchProducts()
  }

  return (
    <div className="product-search-shell">
      <section className="search-panel">
        <h1>Browse products</h1>
        <p>Search, filter, and discover products from our marketplace.</p>
        <form className="search-form" onSubmit={handleSearch}>
          <label>
            Keyword
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Search products" />
          </label>
          <label>
            Category
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
          </label>
          <div className="price-row">
            <label>
              Min price
              <input type="number" min="0" step="0.01" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            </label>
            <label>
              Max price
              <input type="number" min="0" step="0.01" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </label>
          </div>
          <label>
            Stock
            <select value={inStock} onChange={(e) => setInStock(e.target.value)}>
              <option value="">All</option>
              <option value="true">In stock</option>
              <option value="false">Out of stock</option>
            </select>
          </label>
          <div className="search-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Searching…' : 'Search'}
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setTitle('')
                setCategory('')
                setMinPrice('')
                setMaxPrice('')
                setInStock('')
                setProducts(initialProducts)
              }}
            >
              Reset
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
      </section>
      <section className="product-grid">
        {products.length === 0 ? (
          <p className="no-results">No products found.</p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              title={product.title}
              description={product.description}
              price={product.price}
              image={product.image}
              vendorName={product.vendor?.name}
            />
          ))
        )}
      </section>
    </div>
  )
}
