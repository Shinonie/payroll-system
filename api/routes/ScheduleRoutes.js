import express from "express";
const router = express.Router();

import {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
} from "../controllers/ScheduleController.js";
import { isAdmin } from "../middlewares/permission.js";

router.post("/schedule", createSchedule);
router.get("/schedule", getAllSchedules);
router.put("/schedule/:id", updateSchedule);
router.delete("/schedule/:id", deleteSchedule);
router.get("/schedule/:employeeID", getScheduleById);

export default router;
