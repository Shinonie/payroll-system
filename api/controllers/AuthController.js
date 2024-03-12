import Employee from "../models/EmployeeModel.js";
import bcrypt from "bcryptjs";
import { userTypeEnum } from "../constant/enums.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// REGISTER
const register = async (req, res) => {
  const {
    controlNumber,
    firstName,
    lastName,
    middleName,
    email,
    password,
    birthday,
    gender,
    biometricNumber,
    civilStatus,
    address,
    userType,
    SSSLoan,
    PagibigLoan,
    allowance,
    incentives,
    hourlyRate,
  } = req.body;

  try {
    if (!userTypeEnum.includes(userType)) {
      return res.status(400).json({ message: "Invalid user type" });
    }

    const existingEmployee = await Employee.findOne({ email });

    const existingControlNumberEmployee = await Employee.findOne({
      controlNumber,
      biometricNumber,
    });
    if (existingControlNumberEmployee) {
      return res
        .status(400)
        .json({ message: "Employee with this control number already exists" });
    }

    if (existingEmployee) {
      return res
        .status(400)
        .json({ message: "Employee with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      _id: controlNumber,
      controlNumber,
      firstName,
      lastName,
      middleName,
      biometricNumber,
      email,
      password: hashedPassword,
      birthday,
      gender,
      civilStatus,
      address,
      SSSLoan,
      PagibigLoan,
      allowance,
      incentives,
      hourlyRate,
      userType,
    });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const emailData = {
      from: `ALPHA STEEL <${process.env.EMAIL}>`,
      to: email,
      subject: "Acceptance Email",
      html: req.emailTemplate,
    };

    transporter.sendMail(emailData, async (error, info) => {
      if (error) {
        console.log("Error sending email: " + error);
        res.status(500).json({ error: "Failed to send email" });
      } else {
        await newEmployee.save();
        res.status(201).json({
          message: "Employee account created successfully",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating employee account",
      error: error.message,
    });
  }
};

// LOGIN
const login = async (req, res) => {
  // Verify username and password
  const { email, password } = req.body;
  const user = await Employee.findOne({ email, archive: false });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  const token = jwt.sign(
    { id: user._id, email, userType: user.role },
    process.env.SECRET_KEY
  );
  res.cookie("access_token", token, { httpOnly: true });
  res.json({
    message: "Login successful",
    user: {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      userType: user.userType,
      accessToken: token,
    },
  });
};

// LOGOUT
const logout = (req, res) => {
  res.clearCookie("access_token");
  res.json({ message: "Logout successful" });
};

export { login, logout, register };
