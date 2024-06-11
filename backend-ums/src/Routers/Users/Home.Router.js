import { Router } from "express";
import { markAttendence, userLeaveRequest, viewUserData } from "../../Controllers/Users/Home.Controller.js";

const homeRouter = Router();

homeRouter
  .get("/attendance", markAttendence)
  .post("/leave-request", userLeaveRequest)
  .get("/view",viewUserData)

export default homeRouter;
