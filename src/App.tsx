import React from "react";
import { Report } from "./components/Report";

const App: React.FC = () => {
  return (
    <div className="app-container">
      <div className="page-container">
        <h1>Contract Metrics</h1>
        <Report title="Case 1 report" reportType="simple" />
        <div style={{ paddingTop: "2rem" }} />
        <Report title="Case 2 report" reportType="full" />
      </div>
    </div>
  );
};

export default App;
