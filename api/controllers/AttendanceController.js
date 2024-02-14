import multer from "multer";
import csvtojson from "csvtojson";
import Attendance from "../models/AttendanceModel.js";
import { AttendanceStatusSetter } from "../utils/AttendanceStatusSetter.js";
import { AttendanceTableSetter } from "../utils/AttendanceTableSetter.js";
import Adjustment from "../models/AdjustmentModel.js";
import { TimeCalculator } from "../utils/TimeCalculator.js";

const upload = multer({ dest: "../uploads" });

const uploadAttendanceCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const csvFilePath = req.file.path;

    const jsonArray = await csvtojson().fromFile(csvFilePath);

    const formattedTable = await AttendanceTableSetter(jsonArray);

    const formattedData = await AttendanceStatusSetter(formattedTable);
    await Attendance.insertMany(formattedData);

    res
      .status(200)
      .json({ message: "File uploaded successfully", formattedTable });
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

const updateAttendanceTime = async (req, res) => {
  try {
    const { employeeID, id } = req.params;
    const { timeIn, timeOut, breakIn, breakOut } = req.body;

    const attendance = await Attendance.findById(id);

    if (!attendance) {
      return res.status(404).json({ error: "Attendance record not found" });
    }

    if (timeIn) {
      attendance.time.timeIn = timeIn;
    }
    if (timeOut) {
      attendance.time.timeOut = timeOut;
    }
    if (breakIn) {
      attendance.time.breakIn = breakIn;
    }
    if (breakOut) {
      attendance.time.breakOut = breakOut;
    }
    if (attendance.status == "ERROR") attendance.status = "ONTIME";
    if (attendance.breakStatus == "ERROR") attendance.status = "ONTIME";

    attendance.adjustment = true;

    const totalworkupdate = TimeCalculator([attendance]);

    const adjustment = new Adjustment({
      employeeID,
      adjustment: {
        type: "ATTENDANCE",
        attendance: attendance.time,
        workHours: Number(totalworkupdate),
      },
    });

    await attendance.save();
    await adjustment.save();

    res.status(200).json({
      message: "Attendance time updated successfully",
      updatedAttendance: attendance,
      totalworkupdate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  uploadAttendanceCSV,
  upload,
  getAllAttendanceEmployee,
  updateAttendanceTime,
};
