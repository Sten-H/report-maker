import React, { useMemo } from "react";
import contractEvents from "../generated/contract-data.json";
import { createReport, ContractEvent, MonthMetric } from "../lib/report";
import "./Report.css";

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const numberFormatter = new Intl.NumberFormat("sv-SE", {
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

type DataRowProps = {
  metrics: MonthMetric[];
  label: string;
  dataProperty: keyof MonthMetric;
};
const DataRow: React.FC<DataRowProps> = ({ metrics, label, dataProperty }) => {
  return (
    <tr>
      <td>
        <strong>{label}</strong>
      </td>
      {metrics.map((data, i) => (
        <td key={i}>{numberFormatter.format(data[dataProperty])}</td>
      ))}
    </tr>
  );
};

type Props = { title: string; reportType: "simple" | "full" };
export const Report: React.FC<Props> = ({ reportType, title }) => {
  const report = useMemo(
    () => createReport(contractEvents as ContractEvent[], reportType),
    [reportType]
  );
  if (!report) {
    return <div>Generating...</div>;
  }
  return (
    <div className="table-container">
      <table>
        <caption>
          <h2>{title}</h2>
        </caption>
        <thead>
          <tr>
            <th></th>
            {report.map((_, i) => (
              <th key={i}>{monthLabels[i]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <DataRow
            metrics={report}
            dataProperty="activeContracts"
            label="Number of active contracts"
          />
          <DataRow metrics={report} dataProperty="actualGross" label="APGW" />
          <DataRow metrics={report} dataProperty="expectedGross" label="EPGW" />
        </tbody>
      </table>
    </div>
  );
};
