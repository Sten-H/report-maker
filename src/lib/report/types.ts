export type ContractCreatedEvent = {
  name: "ContractCreatedEvent";
  contractId: string;
  premium: number;
  startDate: string;
};

export type PriceIncreasedEvent = {
  name: "PriceIncreasedEvent";
  contractId: string;
  premiumIncrease: number;
  atDate: string;
};

export type PriceDecreasedEvent = {
  name: "PriceDecreasedEvent";
  contractId: string;
  premiumReduction: number;
  atDate: string;
};

export type ContractTerminatedEvent = {
  name: "ContractTerminatedEvent";
  contractId: string;
  terminationDate: string;
};

export type ContractEvent =
  | ContractCreatedEvent
  | PriceIncreasedEvent
  | PriceDecreasedEvent
  | ContractTerminatedEvent;

export type MonthMetric = {
  // gross from year start up to and including this month
  actualGross: number;
  // actual gross plus expectedGross from next month until year end
  expectedGross: number;
  activeContracts: number;
};
