import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [
    {
      name: String,
      qty: Number,
      price: Number,
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    }
  ],
  shippingAddress: {
    address: String,
    city: String,
    postalCode: String,
    country: String,
  },
  totalPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date,
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);