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

const authAdminRouter = Router();

authAdminRouter
  .post("/new", createNewUser)
  .get("/all", getAllUsers)
  .get("/edit/:uid", editUser)
  .put("/update", updateUser)
  .delete("/del/:uid", deleteUser)
  .get("/manageLeaveRequest", manageUserLeaveRequest)
  .post("/logout", logout);

export default authAdminRouter;
