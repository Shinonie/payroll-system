import express from "express";
const router = express.Router();
import {
  uploadAttendanceCSV,
  upload,
  getAllAttendanceEmployee,
  updateAttendanceTime,
  GetAllUnpaidAttendance,
  getAllAttendance,
} from "../controllers/AttendanceController.js";
import { isAdmin } from "../middlewares/permission.js";

router.post("/upload", upload.single("file"), uploadAttendanceCSV);
router.get("/attendance/:employeeID", getAllAttendanceEmployee);
router.get("/attendances/:employeeID", GetAllUnpaidAttendance);
router.get("/attendances", getAllAttendance);
router.put("/attendance/:employeeID/:id", updateAttendanceTime);

export default router;
