import { User } from "../../Models/Users/User.Model.js";
import { Attendence } from "../../Models/Users/Attendence.Model.js";
import { Leave } from "../../Models/Users/Leave.Model.js";
import sendMail from "../../Utils/Send-Mail.js";
import ApiError from "../../Utils/ApiError.js";
import ApiResponse from "../../Utils/ApiResponse.js";
import wrapAsync from "../../Utils/wrapAsync.js";
import { generateRandomToken } from "../../Utils/generateRandomToken.js";
import { ADMIN_EMAIL, PORT, SERVER_URL } from "../../constant.js";

export const markAttendence = wrapAsync(async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user) return next(new ApiError(400, "User Not found"));

  const currentTimeStamp = Date.now();
  const userLastAttendanceRecord = await Attendence.findOne({
    user: user._id,
  }).sort({ date: -1 });

  if (userLastAttendanceRecord) {
    const userLastAttendanceTimeStamp = userLastAttendanceRecord.date.getTime();
    const timeDifference = currentTimeStamp - userLastAttendanceTimeStamp;

    if (timeDifference > 24 * 60 * 60 * 1000) {
      const userAttendence = new Attendence({
        user: user._id,
        status: "present",
      });

      await userAttendence.save();

      res
        .status(200)
        .json(new ApiResponse(true, "Attendance marked as present", {}));
    } else {
      return next(
        new ApiError(
          400,
          "User has already been marked as present within the last 24 hours"
        )
      );
    }
  } else {
    const userAttendence = new Attendence({
      user: user._id,
      status: "present",
    });

    await userAttendence.save();

    res
      .status(200)
      .json(new ApiResponse(true, "Attendance marked as present", {}));
  }
});

export const userLeaveRequest = wrapAsync(async (req, res, next) => {
  const { id } = req.user;
  const { from, to, reason } = req.body;

  const user = await User.findById(id).select("username");
  if (!user) return next(new ApiError(400, "User Not Found"));

  if (!from && !to && !reason)
    return next(new ApiError(400, "From , to , Reason must be required"));

  const currentTimeStamp = Date.now();
  const userLastAttendanceRecord = await Attendence.findOne({
    user: id,
  }).sort({ date: -1 });

  const userLastLeaveRequestRecord = await Leave.findOne({ user: id }).sort({
    date: -1,
  });

  if (userLastAttendanceRecord) {
    const userLastAttendanceTimeStamp = userLastAttendanceRecord.date.getTime();
    const timeDifference = currentTimeStamp - userLastAttendanceTimeStamp;

    if (timeDifference < 24 * 60 * 60 * 1000)
      return next(
        new ApiError(
          400,
          "User has already been marked as present within the last 24 hours"
        )
      );

    const token = generateRandomToken();

    const newLeaveRequest = new Leave({
      user: user._id,
      from,
      to,
      reason,
      leaveRequestToken: token,
    });

    await newLeaveRequest.save();

    sendMail(
      ADMIN_EMAIL,
      "Leave Request",
      `<h1>Dear Admin</h1><br>
     <p>I hope this email finds you well. I am writing to request leave from academy, starting from ${from} to ${to}.</p>
    <br>
    <p>I understand the impact that my absence may have on the team, and I assure you that I will do my best to minimize any disruptions. I will make sure that all pending tasks are completed or delegated before my departure.</p>
    <br>
    <p>Please let me know if you require any further information or if there are any specific procedures I need to follow for this leave request. I am more than happy to discuss this further or provide any additional details.</p>
    <br>
    <p>Please review the request and choose one of the following options:</p>
    <br>
    <p>Thank you for your prompt attention to this matter.</p>
    <br>
    <br>
    <a href="${SERVER_URL}:${PORT}/api/v1/admin/manageLeaveRequest?decision=1&token=${token}" style="padding: 10px 20px; background-color: green; color: white; text-decoration: none; border-radius: 5px;">Approve</a>
    <a href="${SERVER_URL}:${PORT}/api/v1/admin/manageLeaveRequest?decision=0&?token=${token}" style="padding: 10px 20px; background-color: red; color: white; text-decoration: none; border-radius: 5px;">Reject</a>
    <br><br>
    <p>Thank you for considering my request. I appreciate your understanding and support.</p>
    <br>
    <p>Best regards,</p>
    <p>${user.username}</p>
    `
    );

    res
      .status(200)
      .json(new ApiResponse(true, "Leave Request has been send to Admin", {}));
  } else if (userLastLeaveRequestRecord) {
    const userLastLeaveRequestTimeStamp =
      userLastLeaveRequestRecord.date.getTime();
    const timeDifference = currentTimeStamp - userLastLeaveRequestTimeStamp;

    if (timeDifference < 24 * 60 * 60 * 1000)
      return next(
        new ApiError(
          400,
          "User has already create leave request within the last 24 hours"
        )
      );

    const token = generateRandomToken();

    const newLeaveRequest = new Leave({
      user: user._id,
      from,
      to,
      reason,
      leaveRequestToken: token,
    });

    await newLeaveRequest.save();

    sendMail(
      ADMIN_EMAIL,
      "Leave Request",
      `<h1>Dear Admin</h1><br>
     <p>I hope this email finds you well. I am writing to request leave from academy, starting from ${from} to ${to}.</p>
    <br>
    <p>I understand the impact that my absence may have on the team, and I assure you that I will do my best to minimize any disruptions. I will make sure that all pending tasks are completed or delegated before my departure.</p>
    <br>
    <p>Please let me know if you require any further information or if there are any specific procedures I need to follow for this leave request. I am more than happy to discuss this further or provide any additional details.</p>
    <br>
    <p>Please review the request and choose one of the following options:</p>
    <br>
    <p>Thank you for your prompt attention to this matter.</p>
    <br>
    <br>
    <a href="${SERVER_URL}:${PORT}/api/v1/admin/manageLeaveRequest?decision=1&token=${token}" style="padding: 10px 20px; background-color: green; color: white; text-decoration: none; border-radius: 5px;">Approve</a>
    <a href="${SERVER_URL}:${PORT}/api/v1/admin/manageLeaveRequest?decision=0&?token=${token}" style="padding: 10px 20px; background-color: red; color: white; text-decoration: none; border-radius: 5px;">Reject</a>
    <br><br>
    <p>Thank you for considering my request. I appreciate your understanding and support.</p>
    <br>
    <p>Best regards,</p>
    <p>${user.username}</p>
    `
    );

    res
      .status(200)
      .json(new ApiResponse(true, "Leave Request has been send to Admin", {}));
  } else {
    const token = generateRandomToken();

    const newLeaveRequest = new Leave({
      user: user._id,
      from,
      to,
      reason,
      leaveRequestToken: token,
    });

    await newLeaveRequest.save();

    sendMail(
      ADMIN_EMAIL,
      "Leave Request",
      `<h1>Dear Admin</h1><br>
     <p>I hope this email finds you well. I am writing to request leave from academy, starting from ${from} to ${to}.</p>
    <br>
    <p>I understand the impact that my absence may have on the team, and I assure you that I will do my best to minimize any disruptions. I will make sure that all pending tasks are completed or delegated before my departure.</p>
    <br>
    <p>Please let me know if you require any further information or if there are any specific procedures I need to follow for this leave request. I am more than happy to discuss this further or provide any additional details.</p>
    <br>
    <p>Please review the request and choose one of the following options:</p>
    <br>
    <p>Thank you for your prompt attention to this matter.</p>
    <br>
    <br>
    <a href="${SERVER_URL}:${PORT}/api/v1/admin/manageLeaveRequest?decision=1&token=${token}" style="padding: 10px 20px; background-color: green; color: white; text-decoration: none; border-radius: 5px;">Approve</a>
    <a href="${SERVER_URL}:${PORT}/api/v1/admin/manageLeaveRequest?decision=0&?token=${token}" style="padding: 10px 20px; background-color: red; color: white; text-decoration: none; border-radius: 5px;">Reject</a>
    <br><br>
    <p>Thank you for considering my request. I appreciate your understanding and support.</p>
    <br>
    <p>Best regards,</p>
    <p>${user.username}</p>
    `
    );

    res
      .status(200)
      .json(new ApiResponse(true, "Leave Request has been send to Admin", {}));
  }
});

export const viewUserData = wrapAsync(async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user) return next(new ApiError(404, "User Not Found"));

  const result = await User.aggregate([
    // Match the specific user by _id
    {
      $match: {
        _id: user._id,
      },
    },
    // Lookup attendance records for the user
    {
      $lookup: {
        from: "attendences",
        localField: "_id",
        foreignField: "user",
        as: "attendanceRecords",
      },
    },
    // Project the required fields and calculate the lengths
    {
      $project: {
        _id: 1,
        username: 1,
        profileAvatar: 1,
        // Include user details as required
        attendanceDetails: {
          records: {
            $map: {
              input: "$attendanceRecords",
              as: "attendance",
              in: {
                date: "$$attendance.date",
                status: "$$attendance.status",
              },
            },
          },
        },
      },
    },
  ]);

  if (result[0].attendanceDetails.records.length > 0) {
    res.status(200).json(new ApiResponse(true, "User Detail", result));
  } else {
    res.status(200).json(true, "There No Attendance found", {});
  }
});
