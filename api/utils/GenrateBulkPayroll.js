import Payroll from "../models/PayrollModel.js";
import Attendance from "../models/AttendanceModel.js";
import Deduction from "../models/DeductionModel.js";
import Adjustment from "../models/AdjustmentModel.js";
import Employee from "../models/EmployeeModel.js";
import { TimeCalculator } from "./TimeCalculator.js";
import {
  SSSEEContribution,
  PhilHealthContribution,
  PagIbigContribution,
  IncomeTaxContribution,
} from "./TaxCalculator.js";

export const createPayrollData = async (employeeID) => {
  try {
    const employeeData = await Employee.findOne({ controlNumber: employeeID });

    const {
      SSSLoan,
      PagibigLoan,
      hourlyRate,
      incentives,
      allowance,
      biometricNumber,
    } = employeeData;

    const employeeAttendance = await Attendance.find({
      employeeID: biometricNumber,
      adjustment: false,
      payrollStatus: false,
    });

    if (employeeAttendance.length == 0) {
      return null;
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

    return {
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
    };
  } catch (error) {
    console.error(`Error creating payroll data for employeeID: ${employeeID}`);
    console.error(error);
    return null;
  }
};
