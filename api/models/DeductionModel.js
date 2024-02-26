import mongoose from "mongoose";

const deductionSchema = new mongoose.Schema(
  {
    employeeID: {
      type: String,
      ref: "Employee",
      required: true,
    },
    payrollID: { type: String, required: true },
    SSS: { type: Number, required: true },
    SSSLoan: { type: Number, required: true },
    Pagibig: { type: Number, required: true },
    PagibigLoan: { type: Number, required: true },
    PhilHealth: { type: Number, required: true },
    IncomeTax: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Deduction = mongoose.model("Deduction", deductionSchema);

export default Deduction;
