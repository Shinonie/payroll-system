export const TimeCalculator = (mergedAttendance) => {
  return mergedAttendance.map((attendance) => {
    const inTime = new Date(attendance.inTime);
    const outTime = new Date(attendance.outTime);

    const timeDifference = outTime - inTime;

    const hoursDifference = timeDifference / (1000 * 60 * 60);

    return hoursDifference;
  });
};
