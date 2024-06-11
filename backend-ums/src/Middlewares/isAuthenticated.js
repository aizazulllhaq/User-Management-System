import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constant.js";
import ApiError from "../Utils/ApiError.js";

export const checkAuthenticatedUser = (req, res, next) => {
  const { accessToken } = req.cookies;

  req.user = null;

  if (!accessToken) return next();

  try {
    const user = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

    if (!user) return next(new ApiError(400, "Invalid Access Token"));

    req.user = user;

    next();
  } catch (error) {
    next(error); // Ensure the error is passed to the next middleware
  }
};

export const restrictSecureRoutes = (role = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized , Please First Login"));
    }

    if (!req.user.isVerified)
      return next(new ApiError(400, "please first verify your mail"));

    if (!role.includes(req.user.role))
      return next(new ApiError(400, "Role Must be present"));

    next();
  };
};
