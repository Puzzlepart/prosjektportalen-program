import * as React from "react";
import IProgramRiskOverviewProps, { ProgramRiskOverviewDefaultProps } from "./IProgramRiskOverviewProps";
import IProgramRiskOverviewState, { } from "./IProgramRiskOverviewState";
import RiskMatrix from "prosjektportalen/lib/WebParts/RiskMatrix";
import { IDataSourceSearchCustom } from "prosjektportalen/lib/WebParts/DataSource";
import * as common from "../../@Common";
import DataSource from "prosjektportalen/lib/WebParts/DataSource";

export default class ProgramRiskOverview extends React.Component<IProgramRiskOverviewProps, IProgramRiskOverviewState> {
  public static defaultProps = ProgramRiskOverviewDefaultProps;

  constructor(props: IProgramRiskOverviewProps) {
    super(props);

    this.state = { isLoading: true };
  }

  public async componentDidMount() {
    try {
      const searchSettings = await this.buildSearchSettingsFromStoredProjects();
      this.setState({ searchSettings, isLoading: false });
    } catch (errorMessage) {
      this.setState({ errorMessage, isLoading: false });
    }
  }

  public render(): React.ReactElement<IProgramRiskOverviewProps> {
    return (
      <div>
        <h1>Risikooversikt</h1>
        {(!this.state.isLoading) &&
          <RiskMatrix
            dataSource={DataSource.SearchCustom}
            queryTemplate={this.state.searchSettings.QueryTemplate} />}
      </div>
    );
  }

  /**
   * Build search settings from items in stored projects list
   */
  private async buildSearchSettingsFromStoredProjects(): Promise<IDataSourceSearchCustom> {
    try {
      const { items } = await common.getStoredProjectsListContext();
      if (items.length === 0) {
        return null;
      }
      const searchQuery = items.map(({ URL }) => `Path:"${URL}"`).join(" OR ");
      return {
        RowLimit: 500,
        QueryTemplate: String.format(this.props.queryTemplate, searchQuery),
      };
    } catch (err) {
      throw err;
    }
  }

}

export { IProgramRiskOverviewProps, IProgramRiskOverviewState };
