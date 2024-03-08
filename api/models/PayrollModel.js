import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employeeID: {
      type: String,
      ref: "Employee",
      required: true,
    },
    totalDaysPresent: { type: Number, required: true },
    montlySalaryRate: { type: Number, required: true },
    hourlyRate: { type: Number, required: true },
    overtimeHours: { type: Number, default: 0 },
    overtimePay: { type: Number, required: true },
    totalHours: { type: Number, required: true },
    totalDeductions: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deduction",
    },
    dateRange: { type: String, required: true },
    dateCreated: { type: String, required: true },
    incentives: { type: Number, default: 0 },
    allowance: { type: Number, default: 0 },
    totalGrossPay: { type: Number, required: true },
    totalNetPay: { type: Number, required: true },
    status: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const Payroll = mongoose.model("Payroll", payrollSchema);

export default Payroll;
