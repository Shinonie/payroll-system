import Employee from "../models/EmployeeModel.js";
import { userTypeEnum } from "../constant/enums.js";

const RegisterEmployee = async (req, res) => {
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

    const savedEmployee = await newEmployee.save();

    res.status(201).json({
      message: "Employee account created successfully",
      employee: savedEmployee,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating employee account",
      error: error.message,
    });
  }
};

const GetAllAdmin = async (req, res) => {
  try {
    const admins = await Employee.find({ userType: "ADMIN" });
    res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const ArchiveAccount = async (req, res) => {
  const { controlNumber } = req.body;

  try {
    const employee = await Employee.findOne({ controlNumber });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.archive = true;

    await employee.save();

    res.status(200).json({ message: "Account archived successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const DeleteAccount = async (req, res) => {
  const { controlNumber } = req.body;

  try {
    const employee = await Employee.findOne({ controlNumber });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Delete the employee
    await employee.remove();

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  RegisterEmployee,
  GetAllAdmin,
  CreateSchedule,
  ArchiveAccount,
  DeleteAccount,
};
