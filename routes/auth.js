import Router from "express";
import { login, register, logout } from "../controllers/auth.js";
export const authRouter = new Router();


authRouter.route("/login").post(login);
authRouter.route("/register").post(register);
authRouter.route("/logout").get(logout);


export default authRouter;