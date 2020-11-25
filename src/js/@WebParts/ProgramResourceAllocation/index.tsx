import * as React from "react";
import IProgramResourceAllocationProps, { ProgramResourceAllocationDefaultProps } from "./IProgramResourceAllocationProps";
import { IProgramResourceAllocationState } from "./IProgramResourceAllocationState";
import ResourceAllocation from "prosjektportalen/lib/WebParts/ResourceAllocation";
import * as common from "../../@Common";
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import NoStoredProjectsMessage from "../@Components/NoStoredProjectsMessage";

export default class ProgramResourceAllocation extends React.Component<IProgramResourceAllocationProps, IProgramResourceAllocationState> {
  public static defaultProps = ProgramResourceAllocationDefaultProps;

  constructor(props: IProgramResourceAllocationProps) {
    super(props);

    this.state = { isLoading: true };
  }

  public async componentDidMount() {
    try {
      const { items } = await common.getStoredProjectsListContext();
      const searchSettings = await common.buildSearchQueriesFromProgramProjects(items, this.props.queryTemplate);
      this.setState({ searchSettings, isLoading: false });
    } catch (errorMessage) {
      this.setState({ errorMessage, isLoading: false });
    }
  }

  public render(): React.ReactElement<IProgramResourceAllocationProps> {
    if (this.state.errorMessage) {
      return (
        <>
          <h2>Ressursallokering</h2>
          <MessageBar messageBarType={MessageBarType.error}>{this.state.errorMessage}</MessageBar>
        </>
      );
    }
    if (this.state.searchSettings === null) {
      return (
        <>
          <h2>Ressursallokering</h2>
          <NoStoredProjectsMessage />
        </>
      );
    }
    return (
      <>
        <h2>Ressursallokering</h2>
        {(!this.state.isLoading && this.state.searchSettings) &&
          <ResourceAllocation
            searchConfiguration={this.props.searchConfiguration}
            queryTemplate={this.state.searchSettings.QueryTemplate}
          />}
      </>
    );
  }

}

export { IProgramResourceAllocationProps, IProgramResourceAllocationState };
