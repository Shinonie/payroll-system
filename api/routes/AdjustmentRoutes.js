import express from "express";
const router = express.Router();
import { getAllAdjustments } from "../controllers/AdjustmentController.js";
import { isAdmin } from "../middlewares/permission.js";

router.get("/adjustments", getAllAdjustments);

export default router;
