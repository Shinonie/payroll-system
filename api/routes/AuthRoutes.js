import express from "express";
const router = express.Router();
import {
  register,
  login,
  logout,
  forgotPassword,
  recoverAccount,
} from "../controllers/AuthController.js";
import {
  generateEmailMiddleware,
  PasswordRecoverMiddleware,
} from "../middlewares/emailMiddleware.js";

router.post("/register", generateEmailMiddleware, register);
router.post("/forgot", PasswordRecoverMiddleware, forgotPassword);
router.post("/recover/:id/:token", recoverAccount);
router.post("/login", login);
router.post("/logout", logout);

export default router;
