import connectDB from "../../DB/ConnectDB.js";
import { User } from "../Users/User.Model.js";

connectDB();

const registerAdmin = async () => {
  try {
    const admin = new User({
      username: "Admin",
      email: "xyz@admin.com",
      password: "superSecretAdmin",
      role: "ADMIN",
      isVerified: true,
    });

    await admin.save({ validateBeforeSave: false }); // Mean = Not perform validation

    process.exit(1);
  } catch (error) {
    console.log(error.message);
  }
};

registerAdmin();
