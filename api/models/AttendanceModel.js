import mongoose from "mongoose";
import { attendanceStatusEnum } from "../constant/enums.js";

const AttendanceSchema = new mongoose.Schema(
  {
    employeeID: {
      type: String,
      ref: "Employee",
    },
    date: { type: String, required: true },
    inTime: { type: String },
    outTime: { type: String },
    breakIn: { type: String },
    breakOut: { type: String },
    overTimeIn: { type: String },
    overTimeOut: { type: String },
    overtimeHour: { type: Number },
    status: { type: String, required: true, enum: attendanceStatusEnum },
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model("Attendance", AttendanceSchema);

export default Attendance;
