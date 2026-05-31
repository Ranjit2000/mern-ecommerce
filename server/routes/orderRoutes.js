import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderToDelivered,
  updateOrderToPaid,
  deleteOrder
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);

// Admin routes
router.get('/', protect, admin, getAllOrders);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);
router.delete('/:id', protect, admin, deleteOrder);

export default router;