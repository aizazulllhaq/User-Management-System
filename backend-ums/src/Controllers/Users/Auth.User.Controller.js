import { User } from "../../Models/Users/User.Model.js";
import ApiError from "../../Utils/ApiError.js";
import ApiResponse from "../../Utils/ApiResponse.js";
import wrapAsync from "../../Utils/wrapAsync.js";
import {
  uploadOnCloudinary,
  deleteFileFromCloudinary,
} from "../../Config/Cloudinary.Config.js";

export const userProfile = wrapAsync(async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id).select(
    "-password -__v -emailVerificationToken -isVerified -role"
  );

  if (!user) return next(new ApiError(400, "User Not Found with this ID"));

  const result = await User.aggregate([
    {
      $match: {
        _id: user._id,
      },
    },
    {
      $lookup: {
        from: "attendences",
        localField: "_id",
        foreignField: "user",
        as: "attendancesRecord",
      },
    },
    {
      $lookup: {
        from: "leaves",
        localField: "_id",
        foreignField: "user",
        as: "leaveRecords",
      },
    },
    {
      $project: {
        username: 1,
        _id: 0,
        noOfAttendances: { $size: "$attendancesRecord" },
        noOfLeaveRequests: { $size: "$leaveRecords" },
      },
    },
  ]);


  res.status(200).json(new ApiResponse(true, "User Profile Data", result));
});

export const editUserData = wrapAsync(async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id).select(
    "-_id -password -__v -emailVerificationToken -isVerified -email -role"
  );

  if (!user) return next(new ApiError(400, "User Not Found"));

  res.status(200).json(new ApiResponse(true, "User Details", { user }));
});

export const updateUser = wrapAsync(async (req, res, next) => {
  const { id } = req.user;
  const { username, age, grade, gender, country } = req.body;
  const profileImageFile = req.file?.fieldname;

  const user = await User.findById(id);

  if (!user) return next(new ApiError(400, "User Not Found"));

  if (username && username !== user.username) {
    user.username = username;
  }

  if (age && age !== user.age) {
    user.age = age;
  }

  if (grade && grade !== user.grade) {
    user.grade = grade;
  }

  if (gender && gender !== user.gender) {
    user.gender = gender;
  }

  if (country && country !== user.country) {
    user.country = country;
  }

  if (profileImageFile) {
    const oldProfileImage = user.profileAvatar;

    const response = await uploadOnCloudinary(req.file?.path);

    if (response && response.url !== user.profileImageFile) {
      user.profileAvatar = response.url;

      if (oldProfileImage) {
        const publicId = oldProfileImage.split("/").pop().split(".")[0];
        await deleteFileFromCloudinary(publicId);
      }
    }
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(true, "User Profile Updated", user));
});

export const logout = wrapAsync((_, res, next) => {
  res
    .status(200)
    .clearCookie("accessToken")
    .json(new ApiResponse(true, "Logout Successfull", {}));
});
