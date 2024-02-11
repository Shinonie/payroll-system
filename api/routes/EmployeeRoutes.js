import express from "express";
const router = express.Router();
import {
  ChangePassword,
  EditProfile,
  GetAllEmployee,
} from "../controllers/EmployeeController.js";
import { isAdmin } from "../middlewares/permission.js";

router.post("/change-password/:id", ChangePassword);
router.post("/edit-profile/:id", EditProfile);
router.get("/employees", GetAllEmployee);

export default router;
