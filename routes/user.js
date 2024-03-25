import { getAllUsers,getUserById,UpdateUser,UpdateUserPassword,getCurrentUser } from "../controllers/user.js";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.js";

import Router from "express";
export const userRouter = new Router();

userRouter.route("/").get(authorizeRoles("admin"),getAllUsers);
userRouter.route("/me").get(getCurrentUser);
userRouter.route("/update").patch(UpdateUser);
userRouter.route("/update/password").patch(UpdateUserPassword);
userRouter.route("/:id").get(getUserById)


export default userRouter;