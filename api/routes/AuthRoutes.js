import express from "express";
const router = express.Router();
import { register, login, logout } from "../controllers/AuthController.js";
import { generateEmailMiddleware } from "../middlewares/emailMiddleware.js";

router.post("/register", generateEmailMiddleware, register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
