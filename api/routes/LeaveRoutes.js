import express from "express";
const router = express.Router();
import {
  createLeave,
  getLeaveById,
  getAllLeaves,
  updateLeaveDetails,
  approveLeave,
  rejectLeave,
  deleteLeave,
} from "../controllers/LeaveController.js";
import { isAdmin } from "../middlewares/permission.js";

router.post("/leave", createLeave);
router.get("/leave/:id", getLeaveById);
router.get("/leave", isAdmin, getAllLeaves);
router.put("/leave/:id", updateLeaveDetails);
router.put("/leave/approve/:id", isAdmin, approveLeave);
router.put("/leave/reject/:id", isAdmin, rejectLeave);
router.delete("/leave/:id", isAdmin, deleteLeave);

export default router;
