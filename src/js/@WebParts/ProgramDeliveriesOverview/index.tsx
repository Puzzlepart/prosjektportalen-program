import * as React from "react";
import IProgramDeliveriesOverviewXProps, { ProgramDeliveriesOverviewDefaultProps } from "./IProgramDeliveriesOverviewXProps";
import IProgramDeliveriesOverviewXState, { } from "./IProgramDeliveriesOverviewXState";
import DeliveriesOverview from "prosjektportalen/lib/WebParts/DeliveriesOverview";
import * as common from "../../@Common";
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import NoStoredProjectsMessage from "../@Components/NoStoredProjectsMessage";

export default class ProgramDeliveriesOverView extends React.Component<IProgramDeliveriesOverviewXProps, IProgramDeliveriesOverviewXState> {
  public static defaultProps = ProgramDeliveriesOverviewDefaultProps;

  constructor(props: IProgramDeliveriesOverviewXProps) {
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

  public render(): React.ReactElement<IProgramDeliveriesOverviewXProps> {
    if (this.state.errorMessage) {
      return (
        <>
          <h2>Leveranseoversikt</h2>
          <MessageBar messageBarType={MessageBarType.error}>{this.state.errorMessage}</MessageBar>
        </>
      );
    }
    if (this.state.searchSettings === null) {
      return (
        <>
          <h2>Leveranseoversikt</h2>
          <NoStoredProjectsMessage />
        </>
      );
    }
    return (
      <>
        <h2>Leveranseoversikt</h2>
        {(!this.state.isLoading && this.state.searchSettings) &&
          <DeliveriesOverview queryTemplate={this.state.searchSettings.QueryTemplate} />}
      </>
    );
  }

}

export { IProgramDeliveriesOverviewXProps, IProgramDeliveriesOverviewXState };
