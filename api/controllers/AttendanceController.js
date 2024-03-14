import multer from "multer";
import csvtojson from "csvtojson";
import Attendance from "../models/AttendanceModel.js";
import { AttendanceStatusSetter } from "../utils/AttendanceStatusSetter.js";
import { AttendanceTableSetter } from "../utils/AttendanceTableSetter.js";
import Adjustment from "../models/AdjustmentModel.js";
import { TimeCalculator } from "../utils/TimeCalculator.js";
import txtToJSON from "txt-file-to-json";
const upload = multer({ dest: "../uploads" });
import fs from "fs";
import Employee from "../models/EmployeeModel.js";

const uploadAttendanceCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const txtFilePath = req.file.path;

    const tsvData = fs.readFileSync(txtFilePath, "utf-8");

    const lines = tsvData.trim().split("\n");

    const headers = lines[0].split("\t").map((header) => header.trim());

    lines.shift();

    const jsonArray = lines.map((line) => {
      const values = line.split("\t").map((value) => value.trim());
      const dateAndTimeIndex = headers.indexOf("Time");
      if (dateAndTimeIndex !== -1) {
        values[dateAndTimeIndex] = values[dateAndTimeIndex].replace(
          /\s+/g,
          " "
        );
      }
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      return obj;
    });

    const { formattedTable, errors } = await AttendanceTableSetter(jsonArray);

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ error: "Error processing entries", errors });
    }

    const formattedData = await AttendanceStatusSetter(formattedTable);
    await Attendance.insertMany(formattedData);
    res
      .status(200)
      .json({ message: "File uploaded successfully", formattedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllAttendanceEmployee = async (req, res) => {
  try {
    const { employeeID } = req.params;

    const employee = await Employee.findOne({ controlNumber: employeeID });

    const attendanceRecords = await Attendance.find({
      employeeID: employee.biometricNumber,
    });

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

const getAllAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find();

    const populatedAttendance = await Promise.all(
      attendanceRecords.map(async (attendanceRecord) => {
        try {
          const employee = await Employee.findOne({
            biometricNumber: attendanceRecord.employeeID,
          });

          if (employee) {
            const { fullname, employeeID } = employee;

            return {
              ...attendanceRecord.toObject(),
              fullname,
            };
          } else {
            return attendanceRecord;
          }
        } catch (error) {
          console.error("Error while populating attendance:", error);
          return attendanceRecord;
        }
      })
    );

    res.json(populatedAttendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const GetAllUnpaidAttendance = async (req, res) => {
  try {
    const { employeeID } = req.params;

    const employee = await Employee.findOne({ controlNumber: employeeID });

    const attendanceRecords = await Attendance.find({
      employeeID: employee.biometricNumber,
      payrollStatus: false,
    });

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
    const { timeIn, timeOut, breakIn, breakOut, overtimeIn, overtimeOut } =
      req.body;

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
    if (overtimeIn) {
      attendance.time.overTimeIn = overtimeIn;
    }
    if (overtimeOut) {
      attendance.time.overTimeIn = overtimeOut;
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
  GetAllUnpaidAttendance,
  getAllAttendance,
};
