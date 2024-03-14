import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => `SI-${Math.floor(Date.now() / 1000)}`,
      immutable: true,
    },
    employeeID: {
      type: String,
      ref: "Employee",
    },
    biometricNumber: { type: String, required: true },
    range: { type: String, required: true },
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
