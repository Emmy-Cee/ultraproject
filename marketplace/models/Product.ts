import { Schema, model, models } from 'mongoose'

const ProductSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, default: 'general' },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Product = models.Product || model('Product', ProductSchema)
export default Product
