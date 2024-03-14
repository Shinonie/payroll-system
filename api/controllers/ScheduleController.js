import Schedule from "../models/ScheduleModel.js";
import Employee from "../models/EmployeeModel.js";

const createSchedule = async (req, res) => {
  const scheduleArray = req.body;

  try {
    const schedules = scheduleArray.map(async (schedule) => {
      try {
        const employee = await Employee.findOne({
          controlNumber: schedule.employeeID,
        });

        return {
          employeeID: schedule.employeeID,
          biometricNumber: employee.biometricNumber,
          date: schedule.date,
          timeIn: schedule.timeIn,
          breakIn: schedule.breakIn,
          breakOut: schedule.breakOut,
          timeOut: schedule.timeOut,
        };
      } catch (error) {
        // Handle errors here
        console.error("Error finding employee:", error);
        throw error;
      }
    });

    const updatedSchedules = await Promise.all(schedules);
    const range =
      updatedSchedules[0].date +
      " " +
      updatedSchedules[schedules.length - 1].date;

    for (const schedule of updatedSchedules) {
      await Schedule.create({ ...schedule, range });
    }

    res.status(201).json({
      message: "Schedules created successfully",
      schedules: updatedSchedules,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find();

    res.status(200).json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getScheduleById = async (req, res) => {
  const { employeeID } = req.params;

  try {
    const schedule = await Schedule.find({ employeeID });

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.status(200).json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateSchedule = async (req, res) => {
  const scheduleId = req.params.id;
  const { date, timeIn, timeOut, breakIn, breakOut } = req.body.time;

  try {
    const schedule = await Schedule.findByIdAndUpdate(
      scheduleId,
      { date, timeIn, timeOut, breakIn, breakOut },
      { new: true }
    );

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res
      .status(200)
      .json({ message: "Schedule updated successfully", schedule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteSchedule = async (req, res) => {
  const scheduleId = req.params.id;

  try {
    const schedule = await Schedule.findByIdAndDelete(scheduleId);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { createSchedule, getScheduleById, updateSchedule, deleteSchedule };
