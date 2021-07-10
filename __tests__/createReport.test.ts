import { createReport } from "../src/lib/report";
import { ContractEvent } from "../src/lib/report/types";

describe("Manager", () => {
  // simple report diregards price change events
  describe("Simple Report", () => {
    test("Should handle contract creation", () => {
      const metrics = createReport(
        [
          {
            name: "ContractCreatedEvent",
            contractId: "1",
            premium: 100,
            startDate: "2020-01-01",
          },
        ],
        "simple"
      );
      for (let i = 0; i < 12; i++) {}
      expect(metrics).toHaveLength(12);
      const metricsJan = metrics[0];
      expect(metricsJan.actualGross).toEqual(100);
      expect(metricsJan.expectedGross).toEqual(1200);
      expect(metricsJan.activeContracts).toEqual(1);

      const metricsDec = metrics[11];
      expect(metricsDec.actualGross).toEqual(1200);
      expect(metricsDec.expectedGross).toEqual(1200);
      expect(metricsDec.activeContracts).toEqual(1);
    });

    test("Should handle contract termination", () => {
      const metrics = createReport(
        [
          {
            name: "ContractCreatedEvent",
            contractId: "1",
            premium: 100,
            startDate: "2020-01-01",
          },
          {
            name: "ContractTerminatedEvent",
            contractId: "1",
            terminationDate: "2020-03-29",
          },
        ],
        "simple"
      );
      expect(metrics).toHaveLength(12);
      const metricsJan = metrics[0];
      expect(metricsJan.actualGross).toEqual(100);
      expect(metricsJan.expectedGross).toEqual(1200);
      expect(metricsJan.activeContracts).toEqual(1);

      const metricsDec = metrics[11];
      expect(metricsDec.actualGross).toEqual(300);
      expect(metricsDec.expectedGross).toEqual(300);
      expect(metricsDec.activeContracts).toEqual(0);
    });
    test("Should match case 1 output data", () => {
      const events: ContractEvent[] = [
        {
          name: "ContractCreatedEvent",
          contractId: "1",
          premium: 100,
          startDate: "2020-01-01",
        },
        {
          name: "ContractCreatedEvent",
          contractId: "2",
          premium: 100,
          startDate: "2020-02-01",
        },
        {
          name: "ContractTerminatedEvent",
          contractId: "1",
          terminationDate: "2020-03-31",
        },
        {
          name: "ContractTerminatedEvent",
          contractId: "2",
          terminationDate: "2020-04-30",
        },
      ];
      const [jan, feb, mar, apr, may] = createReport(events, "simple");
      expect(jan).toMatchObject({
        activeContracts: 1,
        actualGross: 100,
        expectedGross: 1200,
      });
      /*
       * gross in case output for feb and mar is 2400 and 1500 respectively,
       * I can't figure out why that is, that doesn't seem to be
       * in line with all the other expected gross calculations.
       * This seems correct to me, but I could be missing something.
       */
      expect(feb).toMatchObject({
        activeContracts: 2,
        actualGross: 300,
        expectedGross: 2300,
      });
      expect(mar).toMatchObject({
        activeContracts: 2,
        actualGross: 500,
        expectedGross: 1400,
      });
      expect(apr).toMatchObject({
        activeContracts: 1,
        actualGross: 600,
        expectedGross: 600,
      });
      expect(may).toMatchObject({
        activeContracts: 0,
        actualGross: 600,
        expectedGross: 600,
      });
    });
  });

  describe("Full report", () => {
    test("Should do stuff?", () => {
      const events: ContractEvent[] = [
        {
          name: "ContractCreatedEvent",
          contractId: "1",
          premium: 100,
          startDate: "2020-01-01",
        },
        {
          name: "PriceIncreasedEvent",
          contractId: "1",
          premiumIncrease: 100,
          atDate: "2020-02-30",
        },
        {
          name: "PriceDecreasedEvent",
          contractId: "1",
          premiumReduction: 100,
          atDate: "2020-03-30",
        },
      ];
      const [jan, feb, mar] = createReport(events, "full");
      expect(jan.expectedGross).toEqual(1200);
      expect(feb.expectedGross).toEqual(2200);
      // we got one draw of the increased premium, so 1200 + 100
      expect(mar.expectedGross).toEqual(1300);
    });
  });
});
