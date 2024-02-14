import Payroll from "../models/PayrollModel.js";
import Attendance from "../models/AttendanceModel.js";
import Deduction from "../models/DeductionModel.js";
import Adjustment from "../models/AdjustmentModel.js";
import { TimeCalculator } from "../utils/TimeCalculator.js";
import {
  SSSEEContribution,
  PhilHealthContribution,
  PagIbigContribution,
  IncomeTaxContribution,
} from "../utils/TaxCalculator.js";

const createPayroll = async (req, res) => {
  const {
    employeeID,
    SSSLoan,
    PagibigLoan,
    hourlyRate,
    incentives,
    allowance,
  } = req.body;
  try {
    const employeeAttendance = await Attendance.find({
      employeeID,
      adjustment: false,
    });

    const employeeAdjustment = await Adjustment.find({
      employeeID,
      status: false,
    });

    employeeAttendance.map(
      (attendance) =>
        attendance.status === "ERROR" &&
        res
          .status(500)
          .json({ message: "Attendance Field have no time in or time out" })
    );

    const overtimeRecords = employeeAttendance
      .filter((attendance) => attendance.status === "OVERTIME")
      .map((attendance) => ({
        overtimeHour: attendance.overtimeHour,
      }));

    const late = employeeAttendance.filter(
      (attendance) => attendance.status === "LATE"
    );
    const ontime = employeeAttendance.filter(
      (attendance) => attendance.status === "ONTIME"
    );
    const undertime = employeeAttendance.filter(
      (attendance) => attendance.status === "UNDERTIME"
    );

    const mergedAttendance = [...late, ...ontime, ...undertime];

    const totalOvertimeHours = overtimeRecords.reduce(
      (total, attendance) => total + attendance.overtimeHour,
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
    const totalAdjustmentPay =
      Number(employeeAdjustment[0]?.adjustment?.workHours[0]) * hourlyRate || 0;

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

    const deduction = new Deduction({
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

    const newPayroll = new Payroll({
      employeeID,
      totalDaysPresent,
      montlySalaryRate: montlySalary,
      hourlyRate,
      overtimeHours: totalOvertimeHours,
      totalHours: totalWorkHours,
      totalDeductions: totalWorkHours >= 120 ? totalDeductions._id : null,
      incentives,
      allowance,
      totalGrossPay: totalGrossPay.toFixed(2),
      totalNetPay: totalNetPay.toFixed(2),
    });

    const savePayroll = await newPayroll.save();

    res.status(201).json({
      message: "Payroll created successfully",
      payroll: savePayroll,
      employeeAdjustment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPayrollByEmployee = async (req, res) => {
  const { employeeID } = req.params;

  try {
    const payroll = await Payroll.findById(employeeID).populate(
      "totalDeductions"
    );

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    res.status(200).json(payroll);
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

export { createPayroll, getPayrollByEmployee, updatePayroll, deletePayroll };
