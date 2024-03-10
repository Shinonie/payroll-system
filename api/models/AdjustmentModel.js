import mongoose from "mongoose";

const adjustmentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => `ADI-${Math.floor(Date.now() / 1000)}`,
      immutable: true,
    },
    employeeID: {
      type: String,
      ref: "Employee",
    },
    nextPayroll: { type: Boolean, default: true },
    status: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    strict: false,
  }
);

const Adjustment = mongoose.model("Adjustment", adjustmentSchema);

export default Adjustment;
