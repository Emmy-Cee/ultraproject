import { connectToDatabase } from '../../../lib/mongodb'
import Product from '../../../models/Product'
import Review from '../../../models/Review'
import AddToCartButton from '../../../components/AddToCartButton'
import ReviewForm from '../../../components/ReviewForm'

interface ProductPageProps {
  params: { id: string }
}

export default async function ProductPage({ params }: ProductPageProps) {
  await connectToDatabase()
  const product = await Product.findById(params.id).populate('vendor', 'name').lean()
  if (!product) {
    return <p>Product not found.</p>
  }

  const reviews = await Review.find({ product: product._id }).populate('user', 'name').lean()

  return (
    <main className="page-shell">
      <section className="product-detail">
        <img src={product.image} alt={product.title} />
        <div>
          <h1>{product.title}</h1>
          <p>{product.description}</p>
          <p className="price">${product.price.toFixed(2)}</p>
          <p>Sold by {product.vendor?.name || 'vendor'}</p>
          <AddToCartButton productId={product._id.toString()} />
        </div>
      </section>
      <section className="review-section">
        <h2>Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <article key={review._id.toString()} className="review-card">
              <p>{review.comment}</p>
              <small>
                {review.user?.name || 'Anonymous'} — {review.rating} / 5
              </small>
            </article>
          ))
        )}
        <ReviewForm productId={product._id.toString()} />
      </section>
    </main>
  )
}

