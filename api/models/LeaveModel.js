import mongoose from "mongoose";
import { leaveTypeEnum } from "../constant/enums";

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
    status: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Leaves = mongoose.model("Leaves", leavesSchema);

export default Leaves;
