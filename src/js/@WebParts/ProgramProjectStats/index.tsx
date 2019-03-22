import * as React from "react";
import { IProgramProjectStatsState } from "./IProgramProjectStatsState";
import ProjectStats from "prosjektportalen/lib/WebParts/ProjectStats";
import * as common from "../../@Common";
import { Site } from "@pnp/sp";
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import NoStoredProjectsMessage from "../@Components/NoStoredProjectsMessage";

export default class ProgramProjectStats extends React.Component<{}, IProgramProjectStatsState> {

    constructor(props) {
        super(props);

        this.state = { isLoading: true };
    }

    public async componentDidMount() {
        try {
            let noProjects = false;
            const { items } = await common.getStoredProjectsListContext();
            const rootUrl = await this.getProjectRoot(items);
            if (rootUrl === null) {
                noProjects = true;
            }
            this.setState({ rootUrl, noProjects, isLoading: false });
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
        if (this.state.noProjects) {
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
                        statsFieldsListName=""
                        viewSelectorEnabled={true}
                        chartsConfigListName=""
                        projectRoot={this.state.rootUrl}
                    />}
            </>
        );
    }

    /**
     * Get the root URL of the projects
     *
     * @param items ProjectItem
     */
    private async getProjectRoot(items: common.ProjectItem[]) {
        if (items.length === 0) {
            return null;
        }
        let rootWeb = await new Site(items[0].URL).getRootWeb();
        return rootWeb["_parentUrl"];
    }

}

export { IProgramProjectStatsState };
