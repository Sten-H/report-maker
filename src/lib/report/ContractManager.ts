import {
  ContractCreatedEvent,
  ContractEvent,
  ContractTerminatedEvent,
  PriceDecreasedEvent,
  PriceIncreasedEvent,
} from "./types";
import {
  Contract,
  ContractId,
  getExpectedGross,
  getPremiumForMonth,
} from "./contract";

// simple report will disregard price change events
export type ReportType = "simple" | "full";

export class ContractManager {
  private contracts: Map<ContractId, Contract>;
  private reportType: ReportType;

  constructor(reportType: ReportType) {
    this.contracts = new Map();
    this.reportType = reportType;
  }

  private addContract = (event: ContractCreatedEvent): void => {
    if (this.contracts.has(event.contractId)) {
      throw new Error("Could not create contract, id already exists");
    }
    const contract = {
      startDate: new Date(event.startDate).getTime(),
      premium: event.premium,
      priceAdjustments: [],
    };
    this.contracts.set(event.contractId, contract);
  };

  private terminateContract = (event: ContractTerminatedEvent) => {
    const contract = this.contracts.get(event.contractId);
    if (!contract) {
      throw new Error("Cannot terminate non-existing contract");
    }
    contract.endDate = new Date(event.terminationDate).getTime();
  };

  private adjustContractPrice = (
    event: PriceDecreasedEvent | PriceIncreasedEvent
  ) => {
    const contract = this.contracts.get(event.contractId);
    if (!contract) {
      throw new Error("Cannot adjust price of non-existing contract");
    }
    const priceAdjustment = {
      atDate: new Date(event.atDate).getTime(),
      priceAdjustment:
        event.name === "PriceIncreasedEvent"
          ? event.premiumIncrease
          : -event.premiumReduction,
    };
    contract.priceAdjustments.push(priceAdjustment);
  };

  public addEvent = (event: ContractEvent): void => {
    switch (event.name) {
      case "ContractCreatedEvent":
        return this.addContract(event);
      case "ContractTerminatedEvent":
        return this.terminateContract(event);
      case "PriceDecreasedEvent":
      case "PriceIncreasedEvent":
        if (this.reportType === "simple") return;
        return this.adjustContractPrice(event);
      default:
        break;
    }
  };

  public getMonthlyMetrics = (date: number) => {
    let monthlyGross = 0;
    let expectedGross = 0;
    let activeContracts = 0;
    for (let contract of Array.from(this.contracts.values())) {
      const premium = getPremiumForMonth(contract, date);
      if (premium > 0) {
        activeContracts += 1;
      }
      monthlyGross += premium;
      expectedGross += getExpectedGross(contract, date);
    }
    return { monthlyGross, expectedGross, activeContracts };
  };
}
