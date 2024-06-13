import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET } from "../../constant.js";
import { generateRandomToken } from "../../Utils/generateRandomToken.js";

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "User Must be unique"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  age: {
    type: Number,
    required: [true, "Age is required"],
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: [true, "Gender is required"],
  },
  grade: {
    type: Number,
    required: [true, "Grade is required"],
  },
  country: {
    type: String,
    required: [true, "Country is required"],
  },
  password: {
    type: String,
    required: [true,"Password is required"],
  },
  profileAvatar: {
    type: String,
    required: [true,"Profile Image is required"],
  },
  role: {
    type: String,
    default: "USER",
    enum: ["USER", "ADMIN"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
  },
  msg: {
    type: String,
    default: "User Created Manually",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); // return ( true,false)
};

userSchema.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    {
      id: this._id,
      email: this.email,
      isVerified: this.isVerified,
      role: this.role,
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    }
  );

  return accessToken;
};

export const User = model("User", userSchema);
