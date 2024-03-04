import Employee from "../models/EmployeeModel.js";
import bcrypt from "bcryptjs";

const GetAllEmployee = async (req, res) => {
  try {
    const hrEmployees = await Employee.find({
      userType: "EMPLOYEE",
      archive: false,
    }).select("-password");

    res.status(200).json(hrEmployees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const GetEmployee = async (req, res) => {
  const { employeeID } = req.params;
  try {
    const Employees = await Employee.findOne({
      archive: false,
      controlNumber: employeeID,
    }).select("-password");

    res.status(200).json(Employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const EditProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEmployee = await Employee.findOneAndUpdate(
      { controlNumber: id },
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const ChangePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedEmployee = await Employee.findOneAndUpdate(
      { controlNumber: id },
      { password: hashedPassword },
      { new: true }
    );

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { GetAllEmployee, EditProfile, ChangePassword, GetEmployee };
