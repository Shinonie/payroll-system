import express from "express";
const router = express.Router();

import {
  createPayroll,
  getPayrollByEmployee,
  // updatePayroll,
  deletePayroll,
  getAllPayrolls,
  PayrollRelease,
  createPayrollPreview,
  CreateBulkPayroll,
  getPayrollByID,
} from "../controllers/PayrollController.js";

router.post("/payroll", createPayroll);
router.get("/payroll", getAllPayrolls);
router.post("/payroll/bulk", CreateBulkPayroll);
router.put("/payroll/:employeeID", PayrollRelease);
router.get("/payroll/:employeeID", getPayrollByEmployee);
router.get("/payroll/preview/:employeeID", createPayrollPreview);
router.get("/payroll/post/:payrollID", getPayrollByID);
// router.put("/payroll/:id", updatePayroll);
router.delete("/payroll/:id", deletePayroll);

export default router;
