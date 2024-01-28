import mongoose from "mongoose";
import { attendaceStatusEnum } from "../constant/enums";
const ScheduleSchema = new mongoose.Schema(
  {
    employeeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    Date: { type: Date, required: true },
    InTime: { type: String, required: true },
    OutTime: { type: String, required: true },
    Status: { type: String, required: true, enum: attendaceStatusEnum },
  },
  {
    timestamps: true,
  }
);

const Schedule = mongoose.model("Schedule", ScheduleSchema);

export default Schedule;
