import { Router } from "express";
import {
  createNewUser,
  deleteUser,
  editUser,
  getAllUsers,
  logout,
  manageUserLeaveRequest,
  updateUser,
} from "../../Controllers/admin/Auth.Admin.Controller.js";
import { upload } from "../../Middlewares/Multer.js";

const authAdminRouter = Router();

authAdminRouter
  .post("/new", upload.single("profileImage"), createNewUser)
  .get("/all", getAllUsers)
  .get("/edit/:uid", editUser)
  .patch("/update/:uid", upload.single("profileImage"), updateUser)
  .delete("/del/:uid", deleteUser)
  .get("/manageLeaveRequest", manageUserLeaveRequest)
  .post("/logout", logout);

export default authAdminRouter;
