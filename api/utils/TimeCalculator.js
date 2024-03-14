export const TimeCalculator = (mergedAttendance) => {
  return mergedAttendance.map((attendance) => {
    const inTime = new Date(attendance.time.timeIn);
    let outTime;
    if (attendance.remarks === "HALFDAY") {
      outTime = new Date(attendance.time.breakIn);
    } else {
      outTime = new Date(attendance.time.timeOut);
    }

    const timeDifference = outTime - inTime;

    const hoursDifference = timeDifference / (1000 * 60 * 60);

    return parseFloat(hoursDifference.toFixed(2));
  });
};
