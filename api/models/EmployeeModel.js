import mongoose from "mongoose";
import { userTypeEnum } from "../constant/enums";

const EmployeeSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthday: { type: Date },
    gender: { type: String },
    civilStatus: { type: String },
    address: { type: String },
    userType: { type: String, required: true, enum: userTypeEnum },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", EmployeeSchema);

export default Employee;
