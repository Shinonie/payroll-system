import Employee from "../models/Employee";

const GetAllHR = async (req, res) => {
  try {
    const hrEmployees = await Employee.find({
      userType: "HR",
      archive: false,
    });

    res.status(200).json(hrEmployees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { GetAllHR };
