import mongoose from "mongoose";

const adjustmentSchema = new mongoose.Schema(
  {
    employeeID: {
      type: String,
      ref: "Employee",
    },
    status: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    strict: false,
  }
);

const Adjustment = mongoose.model("Adjustment", adjustmentSchema);

export default Adjustment;
