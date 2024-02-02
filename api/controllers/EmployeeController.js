import Employee from "../models/Employee";

const GetAllEmployee = async (req, res) => {
  try {
    const hrEmployees = await Employee.find({
      userType: "EMPLOYEE",
      archive: false,
    });

    res.status(200).json(hrEmployees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { GetAllEmployee };
