'use client'

import Link from 'next/link'

interface ProductCardProps {
  id: string
  title: string
  description: string
  price: number
  image: string
  vendorName?: string
}

export default function ProductCard({ id, title, description, price, image, vendorName }: ProductCardProps) {
  return (
    <article className="product-card">
      <Link href={`/products/${id}`}>
        <img src={image} alt={title} className="product-image" />
      </Link>
      <div className="product-details">
        <Link href={`/products/${id}`}>
          <h2>{title}</h2>
        </Link>
        <p>{description}</p>
        <div className="product-meta">
          <span>${price.toFixed(2)}</span>
          {vendorName && <small>Sold by {vendorName}</small>}
        </div>
        <Link className="product-link" href={`/products/${id}`}>
          View details
        </Link>
      </div>
    </article>
  )
}
