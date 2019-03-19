import * as React from "react";
import { IProgramDeliveriesOverViewProps } from "./IProgramDeliveriesOverViewProps";
import { IProgramDeliveriesOverViewState } from "./IProgramDeliveriesOverViewState";

export default class ProgramDeliveriesOverView extends React.Component<IProgramDeliveriesOverViewProps, IProgramDeliveriesOverViewState> {
  public render(): React.ReactElement<IProgramDeliveriesOverViewProps> {
    return (
      <div>
        <h1>Leveranseoversikt</h1>
      </div>
    );
  }
}

export { IProgramDeliveriesOverViewProps, IProgramDeliveriesOverViewState };
