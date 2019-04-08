import * as React from "react";
import IProgramDeliveriesOverviewProps, { ProgramDeliveriesOverviewDefaultProps } from "./IProgramDeliveriesOverviewProps";
import IProgramDeliveriesOverviewState, { } from "./IProgramDeliveriesOverviewState";
import DeliveriesOverview from "prosjektportalen/lib/WebParts/DeliveriesOverview";
import * as common from "../../@Common";
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import NoStoredProjectsMessage from "../@Components/NoStoredProjectsMessage";

export default class ProgramDeliveriesOverView extends React.Component<IProgramDeliveriesOverviewProps, IProgramDeliveriesOverviewState> {
  public static defaultProps = ProgramDeliveriesOverviewDefaultProps;

  constructor(props: IProgramDeliveriesOverviewProps) {
    super(props);

    this.state = { isLoading: true };
  }

  public async componentDidMount() {
    try {
      const { items } = await common.getStoredProjectsListContext();
      const searchSettings = await common.buildSearchSettingsFromStoredProjects(items, this.props.queryTemplate);
      this.setState({ searchSettings, isLoading: false });
    } catch (errorMessage) {
      this.setState({ errorMessage, isLoading: false });
    }
  }

  public render(): React.ReactElement<IProgramDeliveriesOverviewProps> {
    if (this.state.errorMessage) {
      return (
        <>
          <h1>Leveranseoversikt</h1>
          <MessageBar messageBarType={MessageBarType.error}>{this.state.errorMessage}</MessageBar>
        </>
      );
    }
    if (this.state.searchSettings === null) {
      return (
        <>
          <h1>Leveranseoversikt</h1>
          <NoStoredProjectsMessage />
        </>
      );
    }
    return (
      <>
        <h1>Leveranseoversikt</h1>
        {(!this.state.isLoading && this.state.searchSettings) &&
          <DeliveriesOverview
            queryTemplate={this.state.searchSettings.QueryTemplate} />}
      </>
    );
  }

}

export { IProgramDeliveriesOverviewProps, IProgramDeliveriesOverviewState };
