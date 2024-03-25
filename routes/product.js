/**
 * Created by;
 * User: Francis Mogbana
 * Date: 23/03/2024
 */

import Router from "express";

import {createProduct,getAllProducts,uploadImage,getSingleProduct,updateProduct,deleteProduct} from "../controllers/product.js";
import { authorizeRoles, authMiddleware } from "../middlewares/auth.js";

import { getSingleProductReviews } from '../controllers/review.js';
export const router = new Router();

router.route('/').get(getAllProducts);
router.route('/create').post([authMiddleware, authorizeRoles('admin')], createProduct);
router.route('/:id').get(getSingleProduct);
router.route('/update/:id').patch([authMiddleware, authorizeRoles('admin')], updateProduct);
router.route('/delete/:id').delete([authMiddleware, authorizeRoles('admin')], deleteProduct);
router.route('/upload/:id').post([authMiddleware, authorizeRoles('admin')],uploadImage);
router.route('/:id/reviews').get(getSingleProductReviews);

export default router;