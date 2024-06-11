import { Router } from "express";
import { login } from "../../Controllers/Admin/Admin.Controller.js";

const adminRouter = Router();

adminRouter.post("/login", login);

export default adminRouter;
