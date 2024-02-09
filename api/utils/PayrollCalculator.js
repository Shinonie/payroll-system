export const calculatePayroll = async ({
  hourlyRate,
  SSSLoan,
  PagibigLoan,
  attendanceRecords,
}) => {
  const overtimeRecords = attendanceRecords
    .filter((attendance) => attendance.status === "OVERTIME")
    .map((attendance) => ({
      overtimeHour: attendance.overtimeHour,
    }));

  const late = attendanceRecords.filter(
    (attendance) => attendance.status === "LATE"
  );
  const ontime = attendanceRecords.filter(
    (attendance) => attendance.status === "ONTIME"
  );
  const undertime = attendanceRecords.filter(
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

  const totalDaysPresent = attendanceRecords.length;
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

  return {
    totalGrossPay,
    totalNetPay,
    totalOvertimeHours,
    totalRegularHour,
    totalDaysPresent,
    overtimePay,
    montlySalary,
    SSS,
    Pagibig,
    PhilHealth,
    incomeTax,
  };
};
