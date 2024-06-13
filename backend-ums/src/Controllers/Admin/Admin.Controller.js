import { User } from "../../Models/Users/User.Model.js";
import ApiError from "../../Utils/ApiError.js";
import ApiResponse from "../../Utils/ApiResponse.js";
import wrapAsync from "../../Utils/wrapAsync.js";

export const login = wrapAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ApiError(400, "Email & Password are required"));

  const admin = await User.findOne({ email });

  if (!admin) return next(new ApiError(400, "Invalid Email"));

  const isPasswordCorrect = await admin.isPasswordCorrect(password);

  if (!isPasswordCorrect) return next(new ApiError(400, "Invalid Credentials"));

  const accessToken = await admin.generateAccessToken();

  const cookieOption = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken,cookieOption)
    .json(new ApiResponse(true, "Admin Login Successfull", {}));
});
