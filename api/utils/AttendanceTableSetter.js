export const AttendanceTableSetter = async (entries) => {
  const groupedEntries = [];

  await Promise.all(
    entries.map(async (entry) => {
      try {
        const { ID, Time } = entry;
        const [date, time] = Time.split(" ");

        const entryDate = new Date(date).toISOString();

        let existingEntry = groupedEntries.find(
          (e) => e.employeeID === ID && e.date === entryDate
        );

        if (!existingEntry) {
          existingEntry = {
            employeeID: ID,
            date: new Date(date).toISOString(),
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
          existingEntry.time.timeIn = new Date(Time).toISOString();
        } else if (!existingEntry.time.breakIn) {
          existingEntry.time.breakIn = new Date(Time).toISOString();
        } else if (!existingEntry.time.breakOut) {
          existingEntry.time.breakOut = new Date(Time).toISOString();
        } else if (!existingEntry.time.timeOut) {
          existingEntry.time.timeOut = new Date(Time).toISOString();
        } else if (!existingEntry.time.overtimeIn) {
          existingEntry.time.overtimeIn = new Date(Time).toISOString();
        } else if (!existingEntry.time.overtimeOut) {
          existingEntry.time.overtimeOut = new Date(Time).toISOString();
        }
      } catch (error) {
        console.error("Error processing entry:", error);
      }
    })
  );

  return groupedEntries;
};
