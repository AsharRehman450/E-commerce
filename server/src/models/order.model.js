// models/Order.model.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String,
  },
  items: [
    {
      productId: String,
      title: String,
      price: Number,
      discount: Number,
      size: String,
      color: String,
      image: String,
      quantity: Number,
    }
  ],
  subtotal: Number,
  discount: Number,
  delivery: Number,
  total: Number,
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Canceled'],
    default: 'Pending',
  }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema)