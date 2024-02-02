import mongoose from "mongoose";
import { userTypeEnum } from "../constant/enums.js";

const EmployeeSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    controlNumber: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthday: { type: Date },
    gender: { type: String },
    civilStatus: { type: String },
    address: { type: String },
    userType: { type: String, required: true, enum: userTypeEnum },
    archive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", EmployeeSchema);

export default Employee;
