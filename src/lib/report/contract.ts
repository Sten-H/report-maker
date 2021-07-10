import { ContractEvent } from "./types";

type PriceAdjustment = {
  atDate: number;
  // relative change, so if decreased by 10 value is -10
  priceAdjustment: number;
};

export type Contract = {
  // dates are stored as ms
  startDate: number;
  // if null termination date is not known and contract is active indefinitely
  endDate?: number;
  premium: number;
  priceAdjustments: PriceAdjustment[];
};

export type ContractId = string;

// non-aggregated monthly metrics, contains no data related to previous months
export type ContractMonthMetric = {
  // Premiums for this month only
  monthlyGross: number;
  // Expected premiums from month (inclusive) to year end
  expectedGross: number;
  activeContracts: number;
};

export const getEventMonth = (evt: ContractEvent): number => {
  const monthRex = /\d{4}-(\d{2})-\d{2}/;
  const match = getEventDateString(evt).match(monthRex);
  if (!match) throw new Error("Could not get event month");
  const [, month] = match;
  // decrement month by one to use javascript date month notation
  return parseInt(month) - 1;
};

export const isContractActive = (c: Contract, date: number): boolean => {
  if (date < c.startDate) return false;
  return !c.endDate || date < c.endDate;
};

export const getPremiumForMonth = (c: Contract, date: number): number => {
  if (!isContractActive(c, date)) {
    return 0;
  }
  let accPremium = c.premium;
  for (let adjustment of c.priceAdjustments) {
    if (adjustment.atDate > date) {
      // we assume adjustments are sorted by date (asc) so all subsequents date will be irrelevant
      break;
    }
    accPremium += adjustment.priceAdjustment;
  }
  return accPremium;
};

export const getEventDateString = (evt: ContractEvent): string => {
  const e = evt as any;
  return e?.startDate ?? e?.terminationDate ?? e?.atDate;
};

export const getExpectedGross = (c: Contract, date: number) => {
  const currDate = new Date(date);
  const startYear = currDate.getUTCFullYear();
  let expectedGross = 0;
  while (currDate.getUTCFullYear() === startYear) {
    if (!isContractActive(c, currDate.getTime())) {
      break;
    }
    expectedGross += getPremiumForMonth(c, currDate.getTime());
    currDate.setUTCMonth(currDate.getUTCMonth() + 1);
  }
  return expectedGross;
};
