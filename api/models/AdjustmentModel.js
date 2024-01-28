import mongoose from "mongoose";
import { leaveTypeEnum } from "../constant/enums";

const adjustmentSchema = new mongoose.Schema(
  {
    employeeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    PayrollAdjustmentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payroll",
    },
    LeaveAdjustmentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leave",
    },
    Status: { type: String },
  },
  {
    timestamps: true,
  }
);

const Adjustment = mongoose.model("Adjustment", adjustmentSchema);

export default Adjustment;
