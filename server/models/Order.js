import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [
    {
      name: String,
      qty: Number,
      price: Number,
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
    }
  ],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  paymentResult: {
    id: String,
    status: String,
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date
  },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);