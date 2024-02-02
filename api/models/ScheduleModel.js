import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema(
  {
    employeeID: {
      type: String,
      ref: "Employee",
    },
    date: { type: String, required: true },
    inTime: { type: String, required: true },
    outTime: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Schedule = mongoose.model("Schedule", ScheduleSchema);

export default Schedule;
