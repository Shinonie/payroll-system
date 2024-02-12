import express from "express";
const router = express.Router();
import {
  getDeductionById,
  updateDeduction,
  deleteDeduction,
} from "../controllers/DeductionController.js";

router.get("/deduction/:id", getDeductionById);
router.put("/deduction/:id", updateDeduction);
router.delete("/deduction/:id", deleteDeduction);

export default router;
