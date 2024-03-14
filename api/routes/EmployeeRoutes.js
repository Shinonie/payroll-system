import express from "express";
const router = express.Router();
import {
  ChangePassword,
  EditProfile,
  GetAllEmployee,
  GetEmployee,
} from "../controllers/EmployeeController.js";
import {
  ArchiveAccount,
  GetAllArchivedAccounts,
  RecoverAccount,
  DeleteAccount,
} from "../controllers/AdminController.js";
import { isAdmin } from "../middlewares/permission.js";

router.put("/change-password/:id", ChangePassword);
router.put("/edit-profile/:id", EditProfile);
router.get("/employee/:employeeID", GetEmployee);
router.get("/employees", GetAllEmployee);

// ARCHIVING
router.get("/employees/archive", GetAllArchivedAccounts);
router.put("/employee", ArchiveAccount);
router.put("/archive/recover", RecoverAccount);
router.put("/archive/delete", DeleteAccount);

export default router;
