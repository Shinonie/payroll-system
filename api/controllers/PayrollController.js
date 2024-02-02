import Payroll from "../models/PayrollModel.js";
import Attendance from "../models/AttendanceModel.js";
import Deduction from "../models/DeductionModel.js";
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
    const employeeAttendance = await Attendance.find({ employeeID });

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

    const totalWorkHours = totalOvertimeHours + totalRegularHour;

    const montlySalary = hourlyRate * 8 * 26;

    const SSS = await SSSEEContribution(montlySalary);
    const Pagibig = await PagIbigContribution(montlySalary);
    const PhilHealth = await PhilHealthContribution(montlySalary);
    const incomeTax = IncomeTaxContribution(montlySalary);

    const totalGrossPay = totalWorkHours * hourlyRate + overtimePay;

    const totalNetPay =
      totalGrossPay -
      (Number(SSS) +
        Number(SSSLoan) +
        Number(Pagibig) +
        Number(PagibigLoan) +
        Number(incomeTax.incomeTax) +
        Number(PhilHealth));

    // console.log(Number(incomeTax.incomeTax));
    // console.log(
    //   Number(SSS) +
    //     Number(SSSLoan) +
    //     Number(Pagibig) +
    //     Number(PagibigLoan) +
    //     Number(incomeTax.incomeTax) +
    //     Number(PhilHealth)
    // );

    const deduction = new Deduction({
      employeeID,
      SSS,
      SSSLoan,
      Pagibig,
      PagibigLoan,
      PhilHealth,
      IncomeTax: incomeTax.incomeTax,
    });

    const totalDeductions = await deduction.save();

    const newPayroll = new Payroll({
      employeeID,
      totalDaysPresent,
      montlySalaryRate: montlySalary,
      hourlyRate,
      overtimeHours: totalOvertimeHours,
      totalHours: totalWorkHours,
      totalDeductions: totalDeductions._id,
      incentives,
      allowance,
      totalGrossPay,
      totalNetPay,
    });

    const savePayroll = await newPayroll.save();

    res
      .status(201)
      .json({ message: "Payroll created successfully", payroll: savePayroll });
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
