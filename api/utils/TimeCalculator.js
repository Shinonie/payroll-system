export const TimeCalculator = (mergedAttendance) => {
  return mergedAttendance.map((attendance) => {
    const inTime = new Date(attendance.time.timeIn);
    const outTime = new Date(attendance.time.timeOut);

    const timeDifference = outTime - inTime;

    const hoursDifference = timeDifference / (1000 * 60 * 60);

    return parseFloat(hoursDifference.toFixed(2));
  });
};
