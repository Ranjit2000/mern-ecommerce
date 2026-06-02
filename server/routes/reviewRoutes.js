import express from 'express';
import {
  addReview,
  getReviews,
  deleteReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:id/reviews', getReviews);
router.post('/:id/reviews', protect, addReview);
router.delete('/:id/reviews/:reviewId', protect, deleteReview);

export default router;