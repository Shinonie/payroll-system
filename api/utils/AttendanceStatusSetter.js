import Schedule from "../models/ScheduleModel.js";

export const AttendanceStatusSetter = async (attendances) => {
  return await Promise.all(
    attendances.map(async (data) => {
      try {
        const schedules = await Schedule.find({
          employeeID: data.employeeID,
        });

        if (schedules.length === 0) {
          throw new Error("Schedule not found");
        }

        const timeIn = new Date(data.time.timeIn);
        const timeOut = new Date(data.time.timeOut);
        const overtimeIn = new Date(data.time.overtimeIn);
        const overtimeOut = new Date(data.time.overtimeOut);
        const scheduleTimeIn = new Date(schedules[0].timeIn);
        const scheduleTimeOut = new Date(schedules[0].timeOut);
        const scheduleBreakOut = new Date(schedules[0].breakOut);

        if (!data.time.timeOut && !data.time.breakIn) {
          return { ...data, breakStatus: "ERROR", status: "ERROR" };
        }

        if (!data.time.timeIn || !data.time.timeOut) {
          return { ...data, breakStatus: "ERROR", status: "ERROR" };
        }

        if (
          data.time.timeIn &&
          !data.time.timeOut &&
          data.time.breakIn &&
          !data.time.breakOut
        ) {
          return { ...data, status: "HALFDAY" };
        }

        let breakStatus =
          data.time.breakOut > scheduleBreakOut ? "OVERBREAK" : "ONTIME";

        if (timeIn.getUTCHours() <= scheduleTimeIn.getUTCHours()) {
          if (
            timeOut.getUTCHours() < 17 &&
            timeOut.getUTCMinutes() > 0 &&
            timeOut.getUTCMinutes() <= 50
          ) {
            return { ...data, breakStatus, status: "UNDERTIME" };
          } else if (
            timeOut.getUTCHours() > 17 &&
            timeOut.getUTCMinutes() >= 30
          ) {
            const overtimeDuration =
              overtimeOut.getUTCHours() - overtimeIn.getUTCHours();
            return {
              ...data,
              overtimeHour: overtimeDuration,
              breakStatus,
              status: "OVERTIME",
            };
          } else {
            return { ...data, breakStatus, status: "ONTIME" };
          }
        } else if (timeIn.getUTCHours() >= scheduleTimeIn.getUTCHours()) {
          return { ...data, breakStatus, status: "LATE" };
        } else {
          throw new Error("Unhandled case");
        }
      } catch (error) {
        console.error(
          `Error processing attendance for employee ${data.employeeID}: ${error.message}`
        );
        return { ...data, breakStatus, status: "ERROR" };
      }
    })
  );
};
