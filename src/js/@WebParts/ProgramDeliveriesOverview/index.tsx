import * as React from "react";
import { IProgramDeliveriesOverviewProps } from "./IProgramDeliveriesOverviewProps";
import { IProgramDeliveriesOverviewState } from "./IProgramDeliveriesOverviewState";

export default class ProgramDeliveriesOverView extends React.Component<IProgramDeliveriesOverviewProps, IProgramDeliveriesOverviewState> {
  public render(): React.ReactElement<IProgramDeliveriesOverviewProps> {
    return (
      <div>
        <h1>Leveranseoversikt</h1>
      </div>
    );
  }
}

export { IProgramDeliveriesOverviewProps, IProgramDeliveriesOverviewState };
