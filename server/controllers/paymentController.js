import Razorpay from 'razorpay'
import crypto from 'crypto'
import Order from '../models/Order.js'

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, orderId } = req.body

    if (!amount || !orderId) {
      return res.status(400).json({ message: 'Amount and orderId required' })
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `receipt_${orderId}`,
      notes: {
        orderId: orderId,
        userId: req.user._id.toString()
      }
    })

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' })
    }

    // Update order as paid
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: razorpay_payment_id,
      status: 'completed',
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    }

    await order.save()

    res.json({
      success: true,
      message: 'Payment verified successfully',
      order
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Razorpay Key
export const getRazorpayKey = async (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID })
}