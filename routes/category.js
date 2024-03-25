/**
 * Created by;
 * User: Francis Mogbana
 * Date: 23/03/2024
 */

import Router from "express";

import {createCategory,getAllCategory,getSingleCategory,updateCategory,deleteCategory} from "../controllers/category.js";
import { authorizeRoles, authMiddleware } from"../middlewares/auth.js";

export const router = new Router();

router.route('/').get(getAllCategory);
router.route('/create').post([authMiddleware, authorizeRoles('admin')], createCategory);
router.route('/:id').get(getSingleCategory);
router.route('/update/:id').patch([authMiddleware, authorizeRoles('admin')], updateCategory);
router.route('/delete/:id').delete([authMiddleware, authorizeRoles('admin')], deleteCategory);

export default router;