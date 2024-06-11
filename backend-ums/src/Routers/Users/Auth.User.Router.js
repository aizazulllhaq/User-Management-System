import { Router } from "express";
import {
  editUserData,
  logout,
  updateUser,
  userProfile,
} from "../../Controllers/Users/Auth.User.Controller.js";
import { upload } from "../../Middlewares/Multer.js";

const authUserRouter = Router();

authUserRouter
  .get("/me", userProfile)
  .get("/edit", editUserData)
  .patch("/update", upload.single("profileImage"), updateUser)
  .get("/logout", logout);

export default authUserRouter;