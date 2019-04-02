import * as React from "react";
import IProgramResourceAllocationProps, { ProgramResourceAllocationDefaultProps } from "./IProgramResourceAllocationProps";
import { IProgramResourceAllocationState } from "./IProgramResourceAllocationState";
import ResourceAllocation from "prosjektportalen/lib/WebParts/ResourceAllocation";
import { IDataSourceSearchCustom } from "prosjektportalen/lib/WebParts/DataSource";
import * as common from "../../@Common";
import DataSource from "prosjektportalen/lib/WebParts/DataSource";
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
      const searchSettings = await this.buildSearchSettingsFromStoredProjects(items);
      this.setState({ searchSettings, isLoading: false });
    } catch (errorMessage) {
      this.setState({ errorMessage, isLoading: false });
    }
  }

  public render(): React.ReactElement<IProgramResourceAllocationProps> {
    if (this.state.errorMessage) {
      return (
        <>
          <h1>Ressursallokering</h1>
          <MessageBar messageBarType={MessageBarType.error}>{this.state.errorMessage}</MessageBar>
        </>
      );
    }
    if (this.state.searchSettings === null) {
      return (
        <>
          <h1>Ressursallokering</h1>
          <NoStoredProjectsMessage />
        </>
      );
    }
    return (
      <>
        <h1>Ressursallokering</h1>
        {(!this.state.isLoading && this.state.searchSettings) &&
          <ResourceAllocation
            searchConfiguration={this.props.searchConfiguration}
            dataSource={DataSource.SearchCustom}
            queryTemplate={this.state.searchSettings.QueryTemplate}
          />}
      </>
    );
  }

  /**
   * Build search settings from items in stored projects list
   */
  private async buildSearchSettingsFromStoredProjects(items: common.ProjectItem[]): Promise<IDataSourceSearchCustom> {
    try {
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

export { IProgramResourceAllocationProps, IProgramResourceAllocationState };
