import { connect } from "mongoose";
import { DB_NAME, MONGO_URL } from "../constant.js";

const connectDB = async () => {
  try {
    const connectionInstance = await connect(`mongodb://127.0.0.1:27017/${DB_NAME}`);

    console.log(
      `\n MongoDB Connected ! DB Host : ${connectionInstance.connection.host}`
    );
  } catch (err) {
    console.log(`MongoDB Connection Error ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
