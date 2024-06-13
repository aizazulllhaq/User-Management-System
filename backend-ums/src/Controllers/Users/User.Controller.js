import { uploadOnCloudinary } from "../../Config/Cloudinary.Config.js";
import { User } from "../../Models/Users/User.Model.js";
import ApiError from "../../Utils/ApiError.js";
import ApiResponse from "../../Utils/ApiResponse.js";
import sendMail from "../../Utils/Send-Mail.js";
import { generateRandomToken } from "../../Utils/generateRandomToken.js";
import wrapAsync from "../../Utils/wrapAsync.js";
import { PORT, SERVER_URL } from "../../constant.js";

export const register = wrapAsync(async (req, res, next) => {
  const { username, email, age, gender, grade, country, password } = req.body;
  const profileImage = req.file?.fieldname;

  const requiredFields = [
    "username",
    "email",
    "age",
    "gender",
    "grade",
    "country",
    "password",
  ];
  const missingFields = [];

  if (!profileImage) {
    missingFields.push("profileImage");
  }

  requiredFields.forEach((field) => {
    if (!req.body[field] || req.body[field].trim() == "") {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0)
    return next(
      new ApiError(400, `Fields required : ( ${missingFields.join(" - ")} )`)
    );

  const isUserExist = await User.findOne({ $or: [{ username }, { email }] });

  if (isUserExist) return next(new ApiError(400, "User Already Exists"));

  // Handle casting error for the 'age' field
  if (isNaN(Number(age))) {
    throw new ApiError(
      400,
      "Invalid age. Please enter a valid number for age."
    );
  }

  // Handle casting error for the 'age' field
  if (isNaN(Number(grade))) {
    throw new ApiError(
      400,
      "Invalid grade. Please enter a valid number for grade."
    );
  }

  // upload profileImage to cloudinary
  const respProfileImage = await uploadOnCloudinary(req.file?.path);
  const token = generateRandomToken();

  // create new user object
  const user = new User({
    username,
    email,
    age,
    grade,
    country,
    gender,
    password,
    profileAvatar: respProfileImage.url,
    emailVerificationToken: token,
  });

  try {
    await user.save();

    const { username, email, profileImage } = user;

    sendMail(
      email,
      "Email Verification Mail",
      `<h1>Dear ${username}</h1>,<br>
    <br>
      <p>Thank you for registering on our site. Please click on the link below to verify your email address:</p>
      <a href="http://localhost:5173/verify-email?token=${token}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Verify Email</a>
      <p>If you did not request this, please ignore this email.</p>
      <br>
      <p>Thank you,<br>Your xyz Company</p>
    `
    );

    res.status(201).json(
      new ApiResponse(
        true,
        `User Created Successfully Please verify your mail`,
        {
          username,
          email,
          profileImage,
        }
      )
    );
  } catch (error) {
    return next(
      new ApiError(
        400,
        `User Couldn't Created , Please try again , Error is : ${error.message}`
      )
    );
  }
});

export const verifyEmail = wrapAsync(async (req, res, next) => {
  const { token } = req.query;

  const user = await User.findOne({ emailVerificationToken: token });

  if (!user) return next(new ApiError(400, "Invalid Token"));

  user.isVerified = true;
  user.emailVerificationToken = "";

  await user.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        true,
        "Email verified successfully , Please login to your account",
        {}
      )
    );
});

export const login = wrapAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return next(new ApiError(400, "User Not Found"));

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) return next(new ApiError(401, "Invalid Credentials"));

  if (!user.isVerified)
    return next(new ApiError(400, "Please first verify your mail"));

  const accessToken = await user.generateAccessToken();

  const cookieOption = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOption)
    .json(new ApiResponse(true, "Login Successfull", { accessToken }));
});
