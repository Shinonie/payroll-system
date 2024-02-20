import express from "express";
const router = express.Router();

import {
  createPayroll,
  getPayrollByEmployee,
  updatePayroll,
  deletePayroll,
} from "../controllers/PayrollController.js";

router.post("/payroll", createPayroll);
router.get("/payroll/:employeeID", getPayrollByEmployee);
router.put("/payroll/:id", updatePayroll);
router.delete("/payroll/:id", deletePayroll);

export default router;
