import { Schema, model } from "mongoose";

const leaveSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    requried: true,
  },
  from: {
    type: Number,
    requried: true,
  },
  to: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  leaveRequestToken: {
    type: String,
  },
});

export const Leave = model("Leave", leaveSchema);
