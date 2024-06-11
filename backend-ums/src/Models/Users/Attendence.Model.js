import { Schema, model } from "mongoose";

const attendenceSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    requried: true,
  },
  date: {
    type: Date,
    default:Date.now, // return milliseconds
  },
  status: {
    type: String,
    enum: ["present", "absent","leave"],
    required: true,
  },
});

export const Attendence = model("Attendence", attendenceSchema);
