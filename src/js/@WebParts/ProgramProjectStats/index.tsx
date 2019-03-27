import * as React from "react";
import { IProgramProjectStatsState } from "./IProgramProjectStatsState";
import { IProgramProjectStatsProps, ProgramProjectStatsDefaultProps } from "./IProgramProjectStatsProps";
import ProjectStats from "prosjektportalen/lib/WebParts/ProjectStats";
import * as common from "../../@Common";
import { Web } from "@pnp/sp";
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import NoStoredProjectsMessage from "../@Components/NoStoredProjectsMessage";
import { IDataSourceSearchCustom } from "prosjektportalen/lib/WebParts/DataSource";

export default class ProgramProjectStats extends React.Component<IProgramProjectStatsProps, IProgramProjectStatsState> {
    public static defaultProps = ProgramProjectStatsDefaultProps;

    constructor(props) {
        super(props);

        this.state = { isLoading: true };
    }

    public async componentDidMount() {
        try {
            const { items } = await common.getStoredProjectsListContext();
            const searchSettings = await this.buildSearchSettingsFromStoredProjects(items);
            const rootWeb = await new Web(_spPageContextInfo.siteAbsoluteUrl);
            this.setState({ items, searchSettings, rootWeb, isLoading: false });
        } catch (errorMessage) {
            this.setState({ errorMessage, isLoading: false });
        }
    }

    public render(): React.ReactElement<{}> {
        if (this.state.errorMessage) {
            return (
                <>
                    <h1>Porteføljeinnsikt</h1>
                    <MessageBar messageBarType={MessageBarType.error}>{this.state.errorMessage}</MessageBar>
                </>
            );
        }
        if (!this.state.items || this.state.items.length === 0) {
            return (
                <>
                    <h1>Porteføljeinnsikt</h1>
                    <NoStoredProjectsMessage />
                </>
            );
        }
        return (
            <>
                <h1>Porteføljeinnsikt</h1>
                {(!this.state.isLoading) &&
                    <ProjectStats
                        viewSelectorEnabled={false}
                        renderCommandBar={false}
                        chartsConfigListName="Diagramkonfigurasjon for programmets prosjekter"
                        rootWeb={this.state.rootWeb}
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

export { IProgramProjectStatsState };
