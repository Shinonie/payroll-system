import express from "express";
const router = express.Router();
import {
  ChangePassword,
  EditProfile,
  GetAllEmployee,
  GetEmployee,
} from "../controllers/EmployeeController.js";
import { isAdmin } from "../middlewares/permission.js";

router.put("/change-password/:id", ChangePassword);
router.put("/edit-profile/:id", EditProfile);
router.get("/employee/:employeeID", GetEmployee);
router.get("/employees", GetAllEmployee);

export default router;
