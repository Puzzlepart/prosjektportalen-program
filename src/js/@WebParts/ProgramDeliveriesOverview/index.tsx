import * as React from "react";
import IProgramDeliveriesOverviewProps, { ProgramDeliveriesOverviewDefaultProps } from "./IProgramDeliveriesOverviewProps";
import IProgramDeliveriesOverviewState, {} from "./IProgramDeliveriesOverviewState";
import DeliveriesOverview from "prosjektportalen/lib/WebParts/DeliveriesOverview";
import { IDataSourceSearchCustom } from "prosjektportalen/lib/WebParts/DataSource";
import * as common from "../../@Common";
import DataSource from "prosjektportalen/lib/WebParts/DataSource";

export default class ProgramDeliveriesOverView extends React.Component<IProgramDeliveriesOverviewProps, IProgramDeliveriesOverviewState> {
  public static defaultProps = ProgramDeliveriesOverviewDefaultProps;

  constructor(props: IProgramDeliveriesOverviewProps) {
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

  public render(): React.ReactElement<IProgramDeliveriesOverviewProps> {
    return (
      <div>
        <h1>Leveranseoversikt</h1>
        {(!this.state.isLoading) &&
          <DeliveriesOverview
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

export { IProgramDeliveriesOverviewProps, IProgramDeliveriesOverviewState };
