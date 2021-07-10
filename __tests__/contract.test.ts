import {
  Contract,
  getExpectedGross,
  getPremiumForMonth,
} from "../src/lib/report/contract";

describe("Contract", () => {
  test("Should get expected gross for full year contract", () => {
    const contract: Contract = {
      premium: 100,
      startDate: new Date("2020-01-01").getTime(),
      priceAdjustments: [],
    };
    const expectedGrossJan = getExpectedGross(
      contract,
      new Date("2020-01-01").getTime()
    );
    const expectedGrossDec = getExpectedGross(
      contract,
      new Date("2020-12-01").getTime()
    );
    expect(expectedGrossJan).toEqual(1200);
    expect(expectedGrossDec).toEqual(100);
  });

  test("Should get expected gross for half year contract", () => {
    const contract: Contract = {
      premium: 100,
      startDate: new Date("2020-01-01").getTime(),
      endDate: new Date("2020-06-29").getTime(),
      priceAdjustments: [],
    };
    const expectedGrossJan = getExpectedGross(
      contract,
      new Date("2020-01-01").getTime()
    );
    const expectedGrossJul = getExpectedGross(
      contract,
      new Date("2020-07-01").getTime()
    );
    expect(expectedGrossJan).toEqual(600);
    expect(expectedGrossJul).toEqual(0);
  });

  test("Should get premium with price adjustments", () => {
    const contract: Contract = {
      premium: 100,
      startDate: new Date("2020-01-01").getTime(),
      endDate: new Date("2020-06-29").getTime(),
      priceAdjustments: [
        { atDate: new Date("2020-01-30").getTime(), priceAdjustment: 10 },
        { atDate: new Date("2020-02-30").getTime(), priceAdjustment: -30 },
      ],
    };
    const janValue = getPremiumForMonth(
      contract,
      new Date("2020-01-01").getTime()
    );
    const febValue = getPremiumForMonth(
      contract,
      new Date("2020-02-01").getTime()
    );
    const marValue = getPremiumForMonth(
      contract,
      new Date("2020-03-01").getTime()
    );
    expect(janValue).toEqual(100);
    expect(febValue).toEqual(110);
    expect(marValue).toEqual(80);
  });
  test("Should get expected gross with price increase", () => {
    const contract: Contract = {
      premium: 100,
      startDate: new Date("2020-01-01").getTime(),
      priceAdjustments: [
        { atDate: new Date("2020-01-30").getTime(), priceAdjustment: 100 },
      ],
    };
    const expectedGross = getExpectedGross(
      contract,
      new Date("2020-01-01").getTime()
    );
    // price is increased after first draw
    expect(expectedGross).toEqual(2300);
  });

  test("Should get expected gross with price decrease", () => {
    const contract: Contract = {
      premium: 100,
      startDate: new Date("2020-01-01").getTime(),
      priceAdjustments: [
        { atDate: new Date("2020-01-30").getTime(), priceAdjustment: -100 },
      ],
    };
    const expectedGross = getExpectedGross(
      contract,
      new Date("2020-01-01").getTime()
    );
    expect(expectedGross).toEqual(100);
  });
});
