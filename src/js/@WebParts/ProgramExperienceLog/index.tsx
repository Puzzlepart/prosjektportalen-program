import * as React from "react";
import IProgramExperienceLogProps, { ProgramExperienceLogDefaultProps } from "./ProgramExperienceLogProps";
import IProgramExperienceLogState from "./IProgramExperienceLogState";
import { ExperienceLog } from "prosjektportalen/lib/WebParts";
import { IDataSourceSearchCustom } from "prosjektportalen/lib/WebParts/DataSource";
import * as common from "../../@Common";
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import NoStoredProjectsMessage from "../@Components/NoStoredProjectsMessage";

export default class ProgramExperienceLog extends React.Component<IProgramExperienceLogProps, IProgramExperienceLogState> {
    public static defaultProps = ProgramExperienceLogDefaultProps;

    constructor(props: IProgramExperienceLogProps) {
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

    public render(): React.ReactElement<IProgramExperienceLogProps> {
        if (this.state.errorMessage) {
            return (
                <>
                    <h1>Erfaringslogg</h1>
                    <MessageBar messageBarType={MessageBarType.error}>{this.state.errorMessage}</MessageBar>
                </>
            );
        }
        if (this.state.searchSettings === null) {
            return (
                <>
                    <h1>Erfaringslogg</h1>
                    <NoStoredProjectsMessage />
                </>
            );
        }
        return (
            <div>
                <h1>Erfaringslogg</h1>
                {(!this.state.isLoading && this.state.searchSettings) &&
                    <ExperienceLog
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

export { IProgramExperienceLogProps, IProgramExperienceLogState };
