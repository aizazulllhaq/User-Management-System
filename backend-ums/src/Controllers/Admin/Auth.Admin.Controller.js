import {
  deleteFileFromCloudinary,
  uploadOnCloudinary,
} from "../../Config/Cloudinary.Config.js";
import { Attendence } from "../../Models/Users/Attendence.Model.js";
import { Leave } from "../../Models/Users/Leave.Model.js";
import { User } from "../../Models/Users/User.Model.js";
import ApiError from "../../Utils/ApiError.js";
import ApiResponse from "../../Utils/ApiResponse.js";
import sendMail from "../../Utils/Send-Mail.js";
import wrapAsync from "../../Utils/wrapAsync.js";

export const createNewUser = wrapAsync(async (req, res, next) => {
  const { id } = req.user;

  const admin = await User.findById(id);

  if (!admin) return next(new ApiError(400, "Invalid ID"));

  if (!admin.role == "ADMIN")
    return next(new ApiError(400, "Role Must be ADMIN"));

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

  const isUserExist = await User.findOne({ email });

  if (isUserExist) return next(new ApiError(400, "User Already Exists"));

  // upload profileImage to cloudinary
  const respProfileImage = await uploadOnCloudinary(req.file?.path);

  // create new user object
  const user = new User({
    username,
    email,
    age,
    grade,
    country,
    gender,
    password,
    msg: "User Created by Admin",
    profileAvatar: respProfileImage.url,
    isVerified: true,
  });

  await user.save();

  const { username: userName, email: Email, msg } = user;

  res.status(201).json(
    new ApiResponse(true, "User Created Successfuly", {
      userName,
      Email,
      msg,
    })
  );
});

export const getAllUsers = wrapAsync(async (req, res, next) => {
  const { id } = req.user;

  const admin = await User.findById(id);
  if (!admin) return next(new ApiError(400, "Invalid ID"));

  const users = await User.find({role:{$ne:"ADMIN"}}).select(
    "username email profileAvatar grade age country"
  );

  if (users.length > 0) {
    res.status(200).json(new ApiResponse(true, "All Users Lists", users));
  } else {
    res.status(200).json(new ApiResponse(true, "No Users Found"));
  }
});

export const editUser = wrapAsync(async (req, res, next) => {
  const { id } = req.user;
  const { uid } = req.params;

  const admin = await User.findById(id);
  if (!admin) return next(new ApiError(400, "Invalid ID"));

  const user = await User.findById(uid).select(
    "username age grade country profileAvatar"
  ); // id by default
  if (!user) return next(new ApiError("User Not found , Invalid ID"));

  res.status(200).json(new ApiResponse(true, "User Data to Edit", user));
});

export const updateUser = wrapAsync(async (req, res, next) => {
  const { id } = req.user;
  const {uid } = req.params;
  const { username, age, grade, country } = req.body;
  const profileImageFile = req.file?.fieldname;

  const admin = await User.findById(id);
  if (!admin) return next(new ApiError(400, "Invalid ID"));

  const user = await User.findById(uid);
  if (!user) return next(new ApiError(400, "User Not Found , Invalid ID"));

  if (username && username !== user.username) {
    user.username = username;
  }

  if (age && age !== user.age) {
    user.age = age;
  }

  if (grade && grade !== user.grade) {
    user.grade = grade;
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

  res
    .status(200)
    .json(new ApiResponse(true, "User Updated Successfully by Admin", user));
});

export const deleteUser = wrapAsync(async (req, res, next) => {
  const { id } = req.user;
  const {uid} = req.params;

  const admin = await User.findById(id);
  if (!admin) return next(new ApiError(400, "Invalid ID"));

  const user = await User.findById(uid);
  if (!user) return next(new ApiError(400, "User Not found , Invalid ID"));

  await User.deleteOne({ _id: uid });

  res.status(200).json(new ApiResponse(true, "User Deleted Successfully", {}));
});

export const manageUserLeaveRequest = wrapAsync(async (req, res, next) => {
  const { id } = req.user;
  const { decision, token } = req.query;

  const admin = await User.findById(id);
  if (!admin) return next(new ApiError(400, "Invalid ID"));

  const leaveRequest = await Leave.findOne({
    leaveRequestToken: token,
  }).populate("user");
  if (!leaveRequest) return next(new ApiError(400, "Invalid Token"));

  const user = leaveRequest.user;

  if (decision === "1") {
    leaveRequest.status = "approved";
    leaveRequest.leaveRequestToken = "";
    await leaveRequest.save();

    const userAttendance = await Attendence.findOne({ user: user.user._id });
    userAttendance.status = "leave";
    await userAttendance.save();

    sendMail(
      user.email,
      "Approved Leave Request",
      ` <p>Dear ${user.username},</p>
  <br>
  <p>We are pleased to inform you that your leave request has been approved by the admin.</p>
  <br>
  <br>
  <p>Please ensure all necessary arrangements are made before your departure.</p>
  <br>
  <p>Thank you for your understanding.</p>
  <br>
  <p>Best regards,</p>
  <p>Admin</p>`
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          true,
          "User Leave Request has been Approved by Admin",
          {}
        )
      );
  } else if (decision === "0") {
    leaveRequest.status = "rejected";
    leaveRequest.leaveRequestToken = "";
    await leaveRequest.save();

    const userAttendance = await Attendence.findOne({ user: user.user._id });
    userAttendance.status = "absent";
    await userAttendance.save();

    sendMail(
      user.email,
      "Rejected Leave Request",
      `  <p>Dear ${user.username},</p>
  <br>
  <p>We regret to inform you that your leave request has been rejected by the admin.</p>
  <br>
  <br>
  <p>Please feel free to contact us if you have any questions or concerns.</p>
  <br>
  <p>Thank you for your understanding.</p>
  <br>
  <p>Best regards,</p>
  <p>Admin</p>`
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          true,
          "User Leave Request has been Rejected by Admin",
          {}
        )
      );
  } else {
    return next(new ApiError(400, "Invalid Decision"));
  }
});

export const logout = wrapAsync(async (req, res, next) => {
  const { id } = req.user;

  const admin = await User.findById(id);
  if (!admin) return next(new ApiError(400, "Invalid ID"));

  res
    .status(200)
    .clearCookie("accessToken")
    .json(new ApiResponse(true, "Admin Logout Successfull", {}));
});
