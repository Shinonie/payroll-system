import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema(
  {
    employeeID: {
      type: String,
      ref: "Employee",
    },
    date: { type: String, required: true },
    timeIn: { type: String, required: true },
    breakIn: { type: String, required: true },
    breakOut: { type: String, required: true },
    timeOut: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Schedule = mongoose.model("Schedule", ScheduleSchema);

export default Schedule;
