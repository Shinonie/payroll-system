import mongoose from "mongoose";
import { userTypeEnum } from "../constant/enums.js";

const EmployeeSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    controlNumber: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String },
    SSSLoan: { type: Number },
    PagibigLoan: { type: Number },
    hourlyRate: { type: Number, required: true },
    allowance: { type: Number },
    incentives: { type: Number },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthday: { type: String, required: true },
    gender: { type: String, required: true },
    civilStatus: { type: String, required: true },
    address: { type: String, required: true },
    userType: { type: String, required: true, enum: userTypeEnum },
    archive: { type: Boolean, default: false },
    adjustment: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

EmployeeSchema.virtual("fullname").get(function () {
  return `${this.firstName} ${this.middleName} ${this.lastName}`;
});

EmployeeSchema.set("toJSON", { virtuals: true });

const Employee = mongoose.model("Employee", EmployeeSchema);

export default Employee;
