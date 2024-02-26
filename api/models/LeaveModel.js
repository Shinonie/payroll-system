import mongoose from "mongoose";
import { leaveTypeEnum, statusEnum } from "../constant/enums.js";

const leavesSchema = new mongoose.Schema(
  {
    employeeID: {
      type: String,
      ref: "Employee",
    },
    leaveType: {
      type: String,
      required: true,
      enum: leaveTypeEnum,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalDays: { type: Number, required: true },
    status: { type: String, enum: statusEnum, default: "PENDING" },
  },
  {
    timestamps: true,
  }
);

const Leaves = mongoose.model("Leaves", leavesSchema);

export default Leaves;
