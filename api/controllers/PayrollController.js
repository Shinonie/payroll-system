import Payroll from "../models/PayrollModel.js";
import Attendance from "../models/AttendanceModel.js";
import Deduction from "../models/DeductionModel.js";
import Adjustment from "../models/AdjustmentModel.js";
import Employee from "../models/EmployeeModel.js";
import { TimeCalculator } from "../utils/TimeCalculator.js";
import {
  SSSEEContribution,
  PhilHealthContribution,
  PagIbigContribution,
  IncomeTaxContribution,
} from "../utils/TaxCalculator.js";
import { createPayrollData } from "../utils/GenrateBulkPayroll.js";

const createPayroll = async (req, res) => {
  const { employeeID } = req.body;
  try {
    const employeeData = await Employee.findOne({ controlNumber: employeeID });

    const {
      SSSLoan,
      PagibigLoan,
      hourlyRate,
      incentives,
      allowance,
      biometricNumber,
      decemberMonthPay,
    } = employeeData;

    const employeeAttendance = await Attendance.find({
      employeeID: biometricNumber,
      adjustment: false,
      payrollStatus: false,
    });

    if (employeeAttendance.length == 0) {
      return res.status(404).json({ message: "No Active Payroll" });
    }

    const employee = await Employee.find({
      controlNumber: employeeID,
      adjustment: true,
    });

    let statusValue;
    let nextPayrollValue;

    if (employee.length > 0) {
      nextPayrollValue = true;
      statusValue = false;
    }

    const employeeAdjustment = await Adjustment.find({
      employeeID,
      nextPayroll: { $eq: nextPayrollValue },
      status: { $eq: statusValue },
    });

    const totalAdjustmentHour = employeeAdjustment.reduce(
      (total, adjustment) => {
        const workHours = adjustment.adjustment.workHours || 0; // Handle cases where workHours might be undefined
        return total + workHours;
      },
      0
    );

    const attendanceError = employeeAttendance
      .filter((attendance) => attendance.status === "ERROR")
      .map((attendance) => attendance.time);

    const attendanceSummary = employeeAttendance.reduce(
      (summary, attendance) => {
        switch (attendance.status) {
          case "OVERTIME":
            summary.overtimeRecords.push({
              overtimeHour: attendance.overtimeHour,
            });
            break;
          case "LATE":
            summary.late.push(attendance);
            break;
          case "ONTIME":
            summary.ontime.push(attendance);
            break;
          case "UNDERTIME":
            summary.undertime.push(attendance);
            break;
          default:
            summary.other.push(attendance);
        }
        return summary;
      },
      { overtimeRecords: [], late: [], ontime: [], undertime: [], other: [] }
    );

    const { overtimeRecords, late, ontime, undertime } = attendanceSummary;

    const mergedAttendance = [...late, ...ontime, ...undertime];

    const totalOvertimeHours = overtimeRecords.reduce(
      (total, overtimeHour) => total + Number(overtimeHour),
      0
    );

    const hoursDifferences = TimeCalculator(mergedAttendance);

    const totalRegularHour = hoursDifferences.reduce(
      (acc, hours) => acc + hours,
      0
    );

    const totalDaysPresent = employeeAttendance.length;
    const overtimeRate = hourlyRate * 1.25;
    const overtimePay = totalOvertimeHours * overtimeRate;
    const totalAdjustmentPay = Number(totalAdjustmentHour) * hourlyRate || 0;

    const totalWorkHours = totalOvertimeHours + totalRegularHour;

    let SSS = 0;
    let Pagibig = 0;
    let PhilHealth = 0;
    let incomeTax = 0;
    const montlySalary = hourlyRate * 8 * 26;

    if (totalWorkHours >= 120) {
      SSS = await SSSEEContribution(montlySalary);
      Pagibig = await PagIbigContribution(montlySalary);
      PhilHealth = await PhilHealthContribution(montlySalary);
      incomeTax = IncomeTaxContribution(montlySalary);
    }
    const allowanceNumber = Number(allowance);
    const incentivesNumber = Number(incentives);
    const totalGrossPay =
      totalWorkHours * hourlyRate +
      overtimePay +
      allowanceNumber +
      incentivesNumber +
      totalAdjustmentPay +
      decemberMonthPay;

    let totalNetPay;
    if (totalWorkHours >= 120) {
      totalNetPay =
        totalGrossPay -
        (Number(SSS) +
          Number(SSSLoan) +
          Number(Pagibig) +
          Number(PagibigLoan) +
          Number(incomeTax) +
          Number(PhilHealth));
    } else {
      totalNetPay = totalGrossPay; // No deductions if totalWorkHours < 120
    }

    const dateCreated = new Date().toISOString();
    const dateRange = `${employeeAttendance[0].date} ${
      employeeAttendance[employeeAttendance.length - 1].date
    }`;

    const newPayroll = new Payroll({
      employeeID,
      totalDaysPresent,
      montlySalaryRate: montlySalary,
      hourlyRate,
      overtimeHours: totalOvertimeHours,
      overtimePay,
      totalHours: totalWorkHours,
      totalDeductions: totalWorkHours >= 120 ? totalDeductions._id : null,
      dateRange,
      decemberMonthPay,
      dateCreated,
      ...(employeeAdjustment.length > 0 && { employeeAdjustment }),
      incentives,
      allowance,
      totalGrossPay: totalGrossPay.toFixed(2),
      totalNetPay: totalNetPay.toFixed(2),
    });

    await Attendance.updateMany(
      {
        employeeID: biometricNumber,
        payrollStatus: false,
      },
      { $set: { payrollStatus: true } }
    );

    const deduction = new Deduction({
      payrollID: newPayroll._id,
      employeeID,
      SSS,
      SSSLoan,
      Pagibig,
      PagibigLoan,
      PhilHealth,
      IncomeTax: incomeTax.incomeTax,
    });

    const totalDeductions =
      totalWorkHours >= 120 ? await deduction.save() : null;

    const savePayroll = await newPayroll.save();

    const updateAdjustment = await Adjustment.find({
      employeeID,
      status: false,
      nextPayroll: true,
    });

    if (updateAdjustment.length > 0) {
      await Employee.findOneAndUpdate(
        { controlNumber: employeeID, adjustment: false },
        { $set: { adjustment: true } }
      );
    }

    if (employee.length > 0 && updateAdjustment.length > 0) {
      await Adjustment.findOneAndUpdate(
        { employeeID, status: false, nextPayroll: true },
        {
          $set: {
            status: true,
            nextPayroll: false,
            payrollID: savePayroll._id,
          },
        }
      );
      await Employee.findOneAndUpdate(
        { controlNumber: employeeID, adjustment: true },
        { $set: { adjustment: false } }
      );
    }

    res.status(201).json({
      message: "Payroll created successfully",
      payroll: savePayroll,
      ...(employeeAdjustment.length > 0 && { employeeAdjustment }),
      ...(attendanceError.length > 0 && {
        attendanceError: {
          message:
            "Please settle ask for the employee to settle their attendance errors",
          attendanceError,
        },
      }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createPayrollPreview = async (req, res) => {
  const { employeeID } = req.params;
  try {
    const employeeData = await Employee.findOne({ controlNumber: employeeID });

    const employeeJson = employeeData.toJSON();

    const {
      SSSLoan,
      PagibigLoan,
      hourlyRate,
      incentives,
      allowance,
      fullname,
      biometricNumber,
      decemberMonthPay,
    } = employeeJson;

    const employeeAttendance = await Attendance.find({
      employeeID: biometricNumber,
      adjustment: false,
      payrollStatus: false,
    });

    if (employeeAttendance.length == 0) {
      return res.status(404).json({ message: "No Active Payroll" });
    }

    const employee = await Employee.find({
      controlNumber: employeeID,
      adjustment: true,
    });

    let statusValue;
    let nextPayrollValue;

    if (employee.length > 0) {
      nextPayrollValue = true;
      statusValue = false;
    }

    const employeeAdjustment = await Adjustment.find({
      employeeID,
      nextPayroll: { $eq: nextPayrollValue },
      status: { $eq: statusValue },
    });

    const totalAdjustmentHour = employeeAdjustment.reduce(
      (total, adjustment) => {
        const workHours = adjustment.adjustment.workHours || 0; // Handle cases where workHours might be undefined
        return total + workHours;
      },
      0
    );

    const attendanceError = employeeAttendance
      .filter((attendance) => attendance.status === "ERROR")
      .map((attendance) => attendance.time);

    const attendanceSummary = employeeAttendance.reduce(
      (summary, attendance) => {
        switch (attendance.status) {
          case "OVERTIME":
            summary.overtimeRecords.push({
              overtimeHour: attendance.overtimeHour,
            });
            break;
          case "LATE":
            summary.late.push(attendance);
            break;
          case "ONTIME":
            summary.ontime.push(attendance);
            break;
          case "UNDERTIME":
            summary.undertime.push(attendance);
            break;
          default:
            summary.other.push(attendance);
        }
        return summary;
      },
      { overtimeRecords: [], late: [], ontime: [], undertime: [], other: [] }
    );

    const { overtimeRecords, late, ontime, undertime } = attendanceSummary;

    const mergedAttendance = [...late, ...ontime, ...undertime];

    const totalOvertimeHours = overtimeRecords.reduce(
      (total, overtimeHour) => total + Number(overtimeHour),
      0
    );

    const hoursDifferences = TimeCalculator(mergedAttendance);

    const totalRegularHour = hoursDifferences.reduce(
      (acc, hours) => acc + hours,
      0
    );

    const totalDaysPresent = employeeAttendance.length;
    const overtimeRate = hourlyRate * 1.25;
    const overtimePay = totalOvertimeHours * overtimeRate;
    const totalAdjustmentPay = Number(totalAdjustmentHour) * hourlyRate || 0;

    const totalWorkHours = totalOvertimeHours + totalRegularHour;

    let SSS = 0;
    let Pagibig = 0;
    let PhilHealth = 0;
    let incomeTax = 0;
    const montlySalary = hourlyRate * 8 * 26;

    if (totalWorkHours >= 120) {
      SSS = await SSSEEContribution(montlySalary);
      Pagibig = await PagIbigContribution(montlySalary);
      PhilHealth = await PhilHealthContribution(montlySalary);
      incomeTax = IncomeTaxContribution(montlySalary);
    }
    const allowanceNumber = Number(allowance);
    const incentivesNumber = Number(incentives);
    const totalGrossPay =
      totalWorkHours * hourlyRate +
      overtimePay +
      allowanceNumber +
      incentivesNumber +
      totalAdjustmentPay;

    let totalNetPay;
    if (totalWorkHours >= 120) {
      totalNetPay =
        totalGrossPay -
        (Number(SSS) +
          Number(SSSLoan) +
          Number(Pagibig) +
          Number(PagibigLoan) +
          Number(incomeTax) +
          Number(PhilHealth));
    } else {
      totalNetPay = totalGrossPay; // No deductions if totalWorkHours < 120
    }

    const dateCreated = new Date().toISOString();
    const dateRange = `${employeeAttendance[0].date} ${
      employeeAttendance[employeeAttendance.length - 1].date
    }`;

    const payrollPreview = {
      employeeID,
      fullname,
      totalDaysPresent,
      montlySalaryRate: montlySalary,
      hourlyRate,
      overtimeHours: totalOvertimeHours,
      overtimePay,
      totalHours: totalWorkHours,
      dateRange,
      dateCreated,
      employeeAdjustment:
        employeeAdjustment.length > 0 ? employeeAdjustment : null,
      attendanceError:
        attendanceError.length > 0
          ? {
              message:
                "Please settle ask for the employee to settle their attendance errors",
              attendanceError,
            }
          : null,
      incentives,
      allowance,
      decemberMonthPay,
      totalGrossPay: totalGrossPay,
      totalNetPay: totalNetPay,
    };

    res.status(200).json({
      message: "Payroll preview generated successfully",
      payrollPreview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPayrollByEmployee = async (req, res) => {
  const { employeeID } = req.params;

  try {
    const payrolls = await Payroll.find({ employeeID });
    const payrollDetails = await Promise.all(
      payrolls.map(async (payroll) => {
        const adjustment = await Adjustment.findOne({
          employeeID,
          payrollID: payroll._id,
        });
        const deduction = await Deduction.findOne({
          employeeID,
          payrollID: payroll._id,
        });

        return {
          payroll,
          adjustment,
          deduction,
        };
      })
    );

    if (!payrolls) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    res.status(200).json(payrollDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePayroll = async (req, res) => {
  const { employeeID } = req.params;
  const {
    totalDaysPresent,
    montlySalary,
    hourlyRate,
    totalOvertimeHours,
    totalWorkHours,
    totalDeductions,
    incentives,
    allowance,
    totalGrossPay,
    totalNetPay,
  } = req.body;

  try {
    const payroll = await Payroll.findByIdAndUpdate(
      employeeID,
      {
        totalDaysPresent,
        montlySalary,
        hourlyRate,
        totalOvertimeHours,
        totalWorkHours,
        totalDeductions,
        incentives,
        allowance,
        totalGrossPay,
        totalNetPay,
      },
      { new: true }
    ).populate("totalDeductions");

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    res.status(200).json({ message: "Payroll updated successfully", payroll });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePayroll = async (req, res) => {
  const { employeeID } = req.params;

  try {
    const payroll = await Payroll.find({ employeeID });

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    res.status(200).json({ message: "Payroll deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find().populate({
      path: "employeeID",
      select: "_id firstName middleName lastName",
    });

    const payrollDetails = await Promise.all(
      payrolls.map(async (payroll) => {
        const adjustment = await Adjustment.findOne({
          payrollID: payroll._id,
        });
        const deduction = await Deduction.findOne({
          payrollID: payroll._id,
        });

        return {
          payroll,
          adjustment,
          deduction,
        };
      })
    );

    if (!payrolls) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    res.status(200).json(payrollDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const PayrollRelease = async (req, res) => {
  const { employeeID } = req.params;
  const { payrollID } = req.body;

  try {
    const payroll = await Payroll.findOneAndUpdate(
      { employeeID, _id: payrollID },
      { $set: { status: true } },
      { new: true }
    );

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    res.status(200).json({ message: "Payroll released successfully", payroll });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const CreateBulkPayroll = async (req, res) => {
  try {
    const employeeIDs = await Employee.distinct("controlNumber");

    const payrollPromises = employeeIDs.map(async (employeeID) => {
      try {
        const payrollData = await createPayrollData(employeeID);
        return payrollData;
      } catch (error) {
        console.error(`Error processing payroll for employeeID: ${employeeID}`);
        console.error(error);
        return null;
      }
    });

    const payrollResults = await Promise.all(payrollPromises);

    const validPayrolls = payrollResults.filter((payroll) => payroll !== null);

    if (validPayrolls.length === 0) {
      return res.status(404).json({
        message: "No payroll found for all employees",
      });
    }

    res.status(201).json({
      message: "Bulk payroll created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createPayroll,
  createPayrollPreview,
  getPayrollByEmployee,
  updatePayroll,
  deletePayroll,
  getAllPayrolls,
  PayrollRelease,
  CreateBulkPayroll,
};
