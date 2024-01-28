import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema(
  {
    employeeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    Date: { type: Date, required: true },
    StartTime: { type: Timestamp, required: true },
    EndTime: { type: Timestamp, required: true },
  },
  {
    timestamps: true,
  }
);

const Schedule = mongoose.model("Schedule", ScheduleSchema);

export default Schedule;
