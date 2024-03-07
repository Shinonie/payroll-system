import Employee from "../models/EmployeeModel.js";
import bcrypt from "bcryptjs";
import { userTypeEnum } from "../constant/enums.js";
import jwt from "jsonwebtoken";

// REGISTER
const register = async (req, res) => {
  const {
    controlNumber,
    fullname,
    email,
    password,
    birthday,
    gender,
    civilStatus,
    address,
    userType,
  } = req.body;

  try {
    // Check if the provided user type is valid
    if (!userTypeEnum.includes(userType)) {
      return res.status(400).json({ message: "Invalid user type" });
    }

    // Check if an employee with the same email already exists
    const existingEmployee = await Employee.findOne({ email });

    if (existingEmployee) {
      return res
        .status(400)
        .json({ message: "Employee with this email already exists" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      _id: controlNumber,
      controlNumber,
      fullname,
      email,
      password: hashedPassword,
      birthday,
      gender,
      civilStatus,
      address,
      userType,
    });

    await newEmployee.save();

    res.status(201).json({
      message: "Employee account created successfully",
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
