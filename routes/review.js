import Router from "express";
import { authMiddleware } from '../middlewares/auth.js';

import {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} from '../controllers/review.js';

export const router = new Router();

router.route('/')
   .post(authMiddleware, createReview)
   .get(getAllReviews);

router.route('/:id')
  .get(getSingleReview)
  .patch(authMiddleware, updateReview)
  .delete(authMiddleware, deleteReview);

  export default router;