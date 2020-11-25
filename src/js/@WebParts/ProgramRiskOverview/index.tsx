import * as React from "react";
import IProgramRiskOverviewProps, { ProgramRiskOverviewDefaultProps } from "./IProgramRiskOverviewProps";
import IProgramRiskOverviewState, { } from "./IProgramRiskOverviewState";
import RiskMatrix from "prosjektportalen/lib/WebParts/RiskMatrix";
import * as common from "../../@Common";
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import NoStoredProjectsMessage from "../@Components/NoStoredProjectsMessage";

export default class ProgramRiskOverview extends React.Component<IProgramRiskOverviewProps, IProgramRiskOverviewState> {
  public static defaultProps = ProgramRiskOverviewDefaultProps;

  constructor(props: IProgramRiskOverviewProps) {
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

  public render(): React.ReactElement<IProgramRiskOverviewProps> {
    if (this.state.errorMessage) {
      return (
        <>
          <h2>Risikooversikt</h2>
          <MessageBar messageBarType={MessageBarType.error}>{this.state.errorMessage}</MessageBar>
        </>
      );
    }
    if (this.state.searchSettings === null) {
      return (
        <>
          <h2>Risikooversikt</h2>
          <NoStoredProjectsMessage />
        </>
      );
    }
    return (
      <>
        <h2>Risikooversikt</h2>
        {(!this.state.isLoading && this.state.searchSettings) &&
          <RiskMatrix
            queryTemplate={this.state.searchSettings.QueryTemplate} />}
      </>
    );
  }

}

export { IProgramRiskOverviewProps, IProgramRiskOverviewState };
