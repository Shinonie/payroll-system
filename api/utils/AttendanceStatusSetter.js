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

        const inTime = new Date(data.inTime);
        const outTime = new Date(data.outTime);
        const scheduleInTime = new Date(schedules[0].inTime);
        const scheduleOutTime = new Date(schedules[0].outTime);

        if (!data.outTime) {
          return { ...data, status: "ERROR", outTime: "" };
        }

        if (!data.inTime) {
          return { ...data, status: "ERROR", inTime: "" };
        }

        if (inTime.getUTCHours() <= scheduleInTime.getUTCHours()) {
          if (
            outTime.getUTCHours() < 17 &&
            outTime.getUTCMinutes() > 0 &&
            outTime.getUTCMinutes() <= 50
          ) {
            return { ...data, status: "UNDERTIME" };
          } else if (outTime.getUTCHours() > 17) {
            const overtimeDuration =
              outTime.getUTCHours() - scheduleOutTime.getUTCHours();
            return {
              ...data,
              overtimeHour: overtimeDuration,
              status: "OVERTIME",
            };
          } else {
            return { ...data, status: "ONTIME" };
          }
        } else if (inTime.getUTCHours() >= scheduleInTime.getUTCHours()) {
          return { ...data, status: "LATE" };
        } else {
          // Handle default case or throw an error
          throw new Error("Unhandled case");
        }
      } catch (error) {
        // Handle errors appropriately
        console.error(
          `Error processing attendance for employee ${data.employeeID}: ${error.message}`
        );
        // You can choose to return a default status or handle the error in another way.
        return { ...data, status: "ERROR" };
      }
    })
  );
};
