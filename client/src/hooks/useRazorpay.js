import { useState } from 'react'
import {
  getRazorpayKey,
  createRazorpayOrder,
  verifyPayment
} from '../api/endpoints'

const useRazorpay = () => {
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if already loaded
      if (window.Razorpay) {
        resolve(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const initiatePayment = async ({ amount, orderId, user, onSuccess, onError }) => {
    setPaymentError('')
    setPaymentLoading(true)

    try {
      // Step 1 - Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay. Check your internet connection.')
      }

      // Step 2 - Get Razorpay key
      const { data: keyData } = await getRazorpayKey()

      // Step 3 - Create Razorpay order
      const { data: orderData } = await createRazorpayOrder({ amount, orderId })

      // Step 4 - Open Razorpay payment modal
      const options = {
        key: keyData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ShopMERN',
        description: 'Order Payment',
        image: '/logo.png',
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#2563EB'
        },
        handler: async (response) => {
          try {
            // Step 5 - Verify payment
            const { data: verifyData } = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId
            })

            if (verifyData.success) {
              onSuccess(verifyData)
            }
          } catch (err) {
            const msg = err.response?.data?.message || 'Payment verification failed'
            setPaymentError(msg)
            if (onError) onError(msg)
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false)
            setPaymentError('Payment cancelled')
            if (onError) onError('Payment cancelled')
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Payment failed'
      setPaymentError(msg)
      if (onError) onError(msg)
    } finally {
      setPaymentLoading(false)
    }
  }

  return { initiatePayment, paymentLoading, paymentError }
}

export default useRazorpay