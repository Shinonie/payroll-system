import { parse, format } from "date-fns";

const dateFormatISO = (dateString) => {
  // Define the input and output date formats
  const inputFormat = "M/dd/yyyy HH:mm";

  const parsedDate = parse(dateString, inputFormat, new Date());

  const isoDate = format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss'Z'");

  return isoDate;
};

export const AttendanceTableSetter = async (entries) => {
  const groupedEntries = [];

  await Promise.all(
    entries.map(async (entry) => {
      try {
        const { ID, Time } = entry;
        const [date, time] = Time.split(" ");

        const entryDate = dateFormatISO(Time);

        let existingEntry = groupedEntries.find(
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
          groupedEntries.push(existingEntry);
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
      }
    })
  );

  return groupedEntries;
};
