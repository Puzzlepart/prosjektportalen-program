import * as React from "react";
import { IProgramResourceAllocationProps } from "./IProgramResourceAllocationProps";
import { IProgramResourceAllocationState } from "./IProgramResourceAllocationState";

export default class ProgramResourceAllocation extends React.Component<IProgramResourceAllocationProps, IProgramResourceAllocationState> {
  public render(): React.ReactElement<IProgramResourceAllocationProps> {
    return (
      <div>
        <h1>Ressursallokering</h1>
      </div>
    );
  }
}

export { IProgramResourceAllocationProps, IProgramResourceAllocationState };
