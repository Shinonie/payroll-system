import { parse, format } from "date-fns";

const dateFormatISO = (dateString) => {
  const inputFormat = "yyyy-MM-dd HH:mm:ss";

  const parsedDate = parse(dateString, inputFormat, new Date());

  const isoDate = format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss'Z'");

  return isoDate;
};

export const AttendanceTableSetter = async (entries) => {
  const formattedTable = [];
  const errors = [];

  await Promise.all(
    entries.map(async (entry) => {
      try {
        const { ID, Time } = entry;
        const [date, time] = Time.split(" ");

        const entryDate = dateFormatISO(Time);

        let existingEntry = formattedTable.find(
          (e) =>
            e.employeeID === ID &&
            e.date.split("T")[0] === entryDate.split("T")[0]
        );

        if (!existingEntry) {
          existingEntry = {
            employeeID: ID,
            date: dateFormatISO(Time),
            time: {
              timeIn: null,
              breakIn: null,
              breakOut: null,
              timeOut: null,
              overtimeIn: null,
              overtimeOut: null,
            },
          };
          formattedTable.push(existingEntry);
        }

        // Assign times from the entry if not already assigned
        if (!existingEntry.time.timeIn) {
          existingEntry.time.timeIn = dateFormatISO(Time);
        } else if (!existingEntry.time.breakIn) {
          existingEntry.time.breakIn = dateFormatISO(Time);
        } else if (!existingEntry.time.breakOut) {
          existingEntry.time.breakOut = dateFormatISO(Time);
        } else if (!existingEntry.time.timeOut) {
          existingEntry.time.timeOut = dateFormatISO(Time);
        } else if (!existingEntry.time.overtimeIn) {
          existingEntry.time.overtimeIn = dateFormatISO(Time);
        } else if (!existingEntry.time.overtimeOut) {
          existingEntry.time.overtimeOut = dateFormatISO(Time);
        }
      } catch (error) {
        console.error("Error processing entry:", error);
        errors.push(error);
      }
    })
  );

  return { formattedTable, errors };
};
