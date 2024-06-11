import { Router } from "express";
import {
  login,
  register,
  verifyEmail,
} from "../../Controllers/Users/User.Controller.js";
import { upload } from "../../Middlewares/Multer.js";

const userRouter = Router();

userRouter
  .post("/register", upload.single("profileImage"), register)
  .get("/verify-email", verifyEmail)
  .post("/login", login);

export default userRouter;
