import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { CORS_ORIGIN } from "./constant.js";
import ApiError from "./Utils/ApiError.js";
import {
  checkAuthenticatedUser,
  restrictSecureRoutes,
} from "./Middlewares/isAuthenticated.js";

const app = express();

// Build-In Middlewares
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(checkAuthenticatedUser);

// Routes
import userRouter from "./Routers/Users/User.Router.js";
import authUserRouter from "./Routers/Users/Auth.User.Router.js";
import adminRouter from "./Routers/Admin/Admin.Router.js";
import authAdminRouter from "./Routers/Admin/Auth.Admin.Router.js";
import homeRouter from "./Routers/Users/Home.Router.js";

app.use("/api/v1/users", userRouter);
app.use(
  "/api/v1/users",
  restrictSecureRoutes(["USER", "ADMIN"]),
  authUserRouter
);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/admin", restrictSecureRoutes(["ADMIN"]), authAdminRouter);
app.use("/profile", restrictSecureRoutes(["USER", "ADMIN"]), homeRouter);

// Not Found Page
app.use("*", (_, res, next) => {
  return next(new ApiError(404, "Page Not Found"));
});

// Error Middleware
app.use((err, _, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (res.headersSent) {
    return next(err); // Delegate to default error handling mechanism
  }

  res.status(statusCode).json({
    success: false,
    message,
  });

  if (statusCode === 500) {
    console.error(err.stack);
  }
});

export default app;
