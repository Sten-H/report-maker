import { ContractManager, ReportType } from "./ContractManager";
import { ContractMonthMetric, getEventMonth } from "./contract";
import { ContractEvent, MonthMetric } from "./types";

// Draw first of every month on given year
const getDrawDates = (year: string) =>
  Array.from(Array(12))
    .map((_, i) => i + 1)
    .map((i) => new Date(`${year}-${i}-01`).getTime());

const getMonthlyMetrics = (
  events: ContractEvent[],
  reportType: ReportType
): ContractMonthMetric[] => {
  // this is a little hacky, I should look into the events to know the year
  const drawDates = getDrawDates("2020");
  const manager = new ContractManager(reportType);
  const monthlyMetrics = [];
  let eventCursor = 0;
  for (let i = 0; i < 12; i++) {
    let currentEvent = events[eventCursor];
    if (currentEvent) {
      while (getEventMonth(currentEvent) === i) {
        manager.addEvent(currentEvent);
        eventCursor += 1;
        currentEvent = events[eventCursor];
        if (!currentEvent) break;
      }
    }
    const metrics = manager.getMonthlyMetrics(drawDates[i]);
    monthlyMetrics.push(metrics);
  }

  return monthlyMetrics;
};

const aggregateMetrics = (metrics: ContractMonthMetric[]): MonthMetric[] => {
  let aggregateActualGross = 0;
  const aggregateMetrics: MonthMetric[] = [];
  for (let metric of metrics) {
    // calculation order is impportant here (due to mutation of aggregateActualGross)
    const expectedGross = aggregateActualGross + metric.expectedGross;
    aggregateActualGross += metric.monthlyGross;
    const monthActualGross = aggregateActualGross;
    aggregateMetrics.push({
      actualGross: monthActualGross,
      expectedGross,
      activeContracts: metric.activeContracts,
    });
  }
  return aggregateMetrics;
};

const createReport = (
  events: ContractEvent[],
  reportType: ReportType
): MonthMetric[] => {
  const metrics = getMonthlyMetrics(events, reportType);
  return aggregateMetrics(metrics);
};

export default createReport;
