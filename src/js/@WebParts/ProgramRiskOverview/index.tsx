import * as React from "react";
import { IProgramRiskOverviewProps } from "./IProgramRiskOverviewProps";
import { IProgramRiskOverviewState } from "./IProgramRiskOverviewState";
import RiskMatrix from "prosjektportalen/lib/WebParts/RiskMatrix";

export default class ProgramRiskOverview extends React.Component<IProgramRiskOverviewProps, IProgramRiskOverviewState> {
  public render(): React.ReactElement<IProgramRiskOverviewProps> {
    return (
      <div>
        <h1>Risikooversikt</h1>
        <RiskMatrix />
      </div>
    );
  }
}

export { IProgramRiskOverviewProps, IProgramRiskOverviewState };
