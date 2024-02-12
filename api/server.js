import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

// ROUTES
import AuthRoutes from "./routes/AuthRoutes.js";
import AttendanceRoutes from "./routes/AttendanceRoutes.js";
import ScheduleController from "./routes/ScheduleRoutes.js";
import PayrollRoutes from "./routes/PayrollRoutes.js";
import TaxesRoute from "./routes/TaxesRoutes.js";
import EmployeeRoutes from "./routes/EmployeeRoutes.js";
import LeaveRoutes from "./routes/LeaveRoutes.js";
import DeductionRoutes from "./routes/DeductionRoutes.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 6000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ROOT ROUTES
app.use("/api/auth", AuthRoutes);
app.use("/api/upload", AttendanceRoutes);
app.use("/api/schedule", ScheduleController);
app.use("/api/payroll", PayrollRoutes);
app.use("/api/taxes", TaxesRoute);
app.use("/api/employee", EmployeeRoutes);
app.use("/api/leave", LeaveRoutes);
app.use("/api/deduction", DeductionRoutes);

app.get("/", (_, res) => res.send("SERVER IS READY!"));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on ${PORT} 💻`));
