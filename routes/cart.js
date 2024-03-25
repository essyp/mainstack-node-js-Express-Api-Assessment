
import Router from "express";
import {
  authMiddleware,
  authorizeRoles,
} from '../middlewares/auth.js';
export const router = new Router();

import {
  getCartItems,
  addToCart,
  removeFromCart,
  decreaseCart,
  increaseCart
} from '../controllers/cart.js';

router.route('/').post(authMiddleware, addToCart);
router.route('/:id').delete(authMiddleware, removeFromCart);
router.route('/increase/:id').patch(authMiddleware, increaseCart);
router.route('/decrease/:id').patch(authMiddleware, decreaseCart);
router.route('/').get(authMiddleware, getCartItems);


export default router;