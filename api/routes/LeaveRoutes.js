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
router.get("/leave", getAllLeaves);
router.put("/leave/:id", updateLeaveDetails);
router.put("/leave/approve/:id", approveLeave);
router.put("/leave/reject/:id", rejectLeave);
router.delete("/leave/:id", deleteLeave);

export default router;
