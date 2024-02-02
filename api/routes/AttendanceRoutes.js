import express from "express";
const router = express.Router();
import {
  uploadAttendanceCSV,
  upload,
  getAllAttendanceEmployee,
  updateAttendanceRecord,
} from "../controllers/AttendanceController.js";
import { isAdmin } from "../middlewares/permission.js";

router.post("/attendance", upload.single("file"), uploadAttendanceCSV);
router.get("/attendance/:employeeID", getAllAttendanceEmployee);
router.put("/attendance/:employeeID", updateAttendanceRecord);

export default router;
