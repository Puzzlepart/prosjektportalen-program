import * as React from "react";
import { IProgramProjectStatsState } from "./IProgramProjectStatsState";
import { IProgramProjectStatsProps, ProgramProjectStatsDefaultProps } from "./IProgramProjectStatsProps";
import ProjectStats from "prosjektportalen/lib/WebParts/ProjectStats";
import * as common from "../../@Common";
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import NoStoredProjectsMessage from "../@Components/NoStoredProjectsMessage";

export default class ProgramProjectStats extends React.Component<IProgramProjectStatsProps, IProgramProjectStatsState> {
    public static defaultProps = ProgramProjectStatsDefaultProps;

    constructor(props) {
        super(props);

        this.state = { isLoading: true };
    }

    public async componentDidMount() {
        try {
            const { items } = await common.getStoredProjectsListContext();
            const searchSettings = await common.buildSearchQueriesFromProgramProjects(items, this.props.queryTemplate);
            this.setState({ items, searchSettings, isLoading: false });
        } catch (errorMessage) {
            this.setState({ errorMessage, isLoading: false });
        }
    }

    public render(): React.ReactElement<{}> {
        if (this.state.errorMessage) {
            return (
                <>
                    <h2>Porteføljeinnsikt</h2>
                    <MessageBar messageBarType={MessageBarType.error}>{this.state.errorMessage}</MessageBar>
                </>
            );
        }
        if (!this.state.items || this.state.items.length === 0) {
            return (
                <>
                    <h2>Porteføljeinnsikt</h2>
                    <NoStoredProjectsMessage />
                </>
            );
        }
        return (
            <>
                <h2>Porteføljeinnsikt</h2>
                {(!this.state.isLoading) &&
                    <ProjectStats
                        viewSelectorEnabled={false}
                        renderCommandBar={false}
                        chartsConfigListName="Diagramkonfigurasjon for programmets prosjekter"
                        queryTemplate={this.state.searchSettings}//{this.state.searchSettings.QueryTemplate}
                    />}
            </>
        );
    }

}

export { IProgramProjectStatsState };
