import multer from "multer";
import csvtojson from "csvtojson";
import Attendance from "../models/AttendanceModel.js";
import { AttendanceStatusSetter } from "../utils/AttendanceStatusSetter.js";

const upload = multer({ dest: "../uploads" });

const uploadAttendanceCSV = async (req, res) => {
  console.log(req.file);
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const csvFilePath = req.file.path;

    const jsonArray = await csvtojson().fromFile(csvFilePath);

    console.log(jsonArray);
    const formattedData = await AttendanceStatusSetter(jsonArray);

    await Attendance.insertMany(formattedData);

    res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllAttendanceEmployee = async (req, res) => {
  try {
    const { employeeID } = req.params;

    const attendanceRecords = await Attendance.find({ employeeID });

    if (attendanceRecords.length === 0) {
      return res
        .status(404)
        .json({ message: "Attendance records not found for the employee" });
    }

    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateAttendanceRecord = async (req, res) => {
  const { employeeID } = req.params;
  try {
    const { date, newStatus, inTime, outTime } = req.body;

    if (!employeeID || !date || !newStatus) {
      return res
        .status(400)
        .json({ error: "EmployeeID, date, and newStatus are required" });
    }

    const existingRecord = await Attendance.findOne({
      employeeID,
      date,
      status: "ERROR",
    });

    if (!existingRecord) {
      return res.status(404).json({
        message:
          "Attendance record not found with status 'ERROR' and the provided EmployeeID",
      });
    }

    existingRecord.status = newStatus;
    existingRecord.inTime = inTime || existingRecord.inTime;
    existingRecord.outTime = outTime || existingRecord.outTime;

    await existingRecord.save();

    res.status(200).json({ message: "Attendance record updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  uploadAttendanceCSV,
  upload,
  getAllAttendanceEmployee,
  updateAttendanceRecord,
};
