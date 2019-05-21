import * as React from "react";
import IProgramExperienceLogProps, { ProgramExperienceLogDefaultProps } from "./ProgramExperienceLogProps";
import IProgramExperienceLogState from "./IProgramExperienceLogState";
import { ExperienceLog } from "prosjektportalen/lib/WebParts";
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
            const { items } = await common.getStoredProjectsListContext();
            const searchSettings = await common.buildSearchSettingsFromStoredProjects(items, this.props.queryTemplate);
            this.setState({ searchSettings, isLoading: false });
        } catch (errorMessage) {
            this.setState({ errorMessage, isLoading: false });
        }
    }

    public render(): React.ReactElement<IProgramExperienceLogProps> {
        if (this.state.errorMessage) {
            return (
                <>
                    <h2>Erfaringslogg</h2>
                    <MessageBar messageBarType={MessageBarType.error}>{this.state.errorMessage}</MessageBar>
                </>
            );
        }
        if (this.state.searchSettings === null) {
            return (
                <>
                    <h2>Erfaringslogg</h2>
                    <NoStoredProjectsMessage />
                </>
            );
        }
        return (
            <>
                <h2>Erfaringslogg</h2>
                {(!this.state.isLoading && this.state.searchSettings) &&
                    <ExperienceLog
                        queryTemplate={this.state.searchSettings.QueryTemplate}
                    />}
            </>
        );
    }

}

export { IProgramExperienceLogProps, IProgramExperienceLogState };
