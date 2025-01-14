import mongoose from "mongoose";
import {
  attendanceStatusEnum,
  remarksEnum,
  breakStatusEnum,
} from "../constant/enums.js";

const AttendanceSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => `AI-${Math.floor(Date.now() / 1000)}`,
      immutable: true,
    },
    employeeID: {
      type: String,
      ref: "Employee",
    },
    date: { type: String, required: true },
    time: {
      timeIn: { type: String },
      timeOut: { type: String },
      breakIn: { type: String },
      breakOut: { type: String },
      overTimeIn: { type: String },
      overTimeOut: { type: String },
      overtimeHour: { type: Number },
    },
    status: {
      type: String,
      required: true,
      default: "ONTIME",
      enum: attendanceStatusEnum,
    },
    breakStatus: {
      type: String,
      default: "ONTIME",
      enum: breakStatusEnum,
    },
    remarks: {
      type: String,
      default: "WHOLEDAY",
      enum: remarksEnum,
    },
    adjustment: { type: Boolean, default: false },
    payrollStatus: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model("Attendance", AttendanceSchema);

export default Attendance;
