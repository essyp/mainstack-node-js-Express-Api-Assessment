/**
 * Created by;
 * User: Francis Mogbana
 * Date: 23/03/2024
 */

import Router from "express";

import {
  authMiddleware,
  authorizeRoles,
} from '../middlewares/auth.js';

import {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrderStatus,
} from '../controllers/order.js';

export const router = new Router();

router
  .route('/')
  .post(authMiddleware, createOrder)
  .get(authMiddleware, authorizeRoles('admin'), getAllOrders);

router.route('/me').get(authMiddleware, getCurrentUserOrders);

router
  .route('/:id')
  .get(authMiddleware, getSingleOrder)
  .patch(authMiddleware, authorizeRoles('admin'), updateOrderStatus);

  export default router;