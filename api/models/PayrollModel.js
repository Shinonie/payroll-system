import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employeeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    totalDaysPresent: { type: Number, required: true },
    totalDaysAbsent: { type: Number, required: true },
    salaryRate: { type: Number, required: true },
    hourlyRate: { type: Number, required: true },
    overtime: { type: Number, required: true },
    totalHoursotalHours: { type: Number, required: true },
    totalDeductions: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deduction",
      required: true,
    },
    totalGrossPay: { type: Number, required: true },
    totalNetPay: { type: Number, required: true },
    status: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Payroll = mongoose.model("Payroll", payrollSchema);

export default Payroll;
