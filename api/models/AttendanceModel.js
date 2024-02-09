import mongoose from "mongoose";
import {
  attendanceStatusEnum,
  remarksEnum,
  breakStatusEnum,
} from "../constant/enums.js";

const AttendanceSchema = new mongoose.Schema(
  {
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
    status: { type: String, required: true, enum: attendanceStatusEnum },
    breakStatus: { type: String, required: true, enum: breakStatusEnum },
    remarks: {
      type: String,
      default: "WHOLEDAY",
      enum: remarksEnum,
    },
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model("Attendance", AttendanceSchema);

export default Attendance;
