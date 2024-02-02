export const taxTables = {
  DAILY: [
    { range: [0, 685], tax: 0 },
    { range: [686, 1095], tax: 0.15, percentage: 0.15 },
    { range: [1096, 2191], tax: 61.65, percentage: 0.2 },
    { range: [2192, 5478], tax: 280.85, percentage: 0.25 },
    { range: [5479, 21917], tax: 1102.6, percentage: 0.3 },
    { range: [21918, Infinity], tax: 6034.3, percentage: 0.35 },
  ],
  WEEKLY: [
    { range: [0, 4808], tax: 0 },
    { range: [4809, 7691], tax: 0.15, percentage: 0.15 },
    { range: [7692, 15384], tax: 432.6, percentage: 0.2 },
    { range: [15385, 38461], tax: 1971.2, percentage: 0.25 },
    { range: [38462, 153845], tax: 7740.45, percentage: 0.3 },
    { range: [153846, Infinity], tax: 42355.65, percentage: 0.35 },
  ],
  SEMI_MONTHLY: [
    { range: [0, 10417], tax: 0 },
    { range: [10418, 16666], tax: 0.15, percentage: 0.15 },
    { range: [16667, 33332], tax: 937.5, percentage: 0.2 },
    { range: [33333, 83332], tax: 4270.7, percentage: 0.25 },
    { range: [83333, 333332], tax: 16770.7, percentage: 0.3 },
    { range: [333333, Infinity], tax: 91770.7, percentage: 0.35 },
  ],
  MONTHLY: [
    { range: [0, 20833], tax: 0 },
    { range: [20834, 33332], tax: 0.15, percentage: 0.15 },
    { range: [33333, 66666], tax: 1875.0, percentage: 0.2 },
    { range: [66667, 166666], tax: 8541.8, percentage: 0.25 },
    { range: [166667, 666666], tax: 33541.8, percentage: 0.3 },
    { range: [666667, Infinity], tax: 183541.8, percentage: 0.35 },
  ],
};
