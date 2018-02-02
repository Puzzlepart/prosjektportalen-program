//#region Imports
import * as React from "react";
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import IProgramBenefitsOverviewProps, { ProgramBenefitsOverviewDefaultProps } from "./IProgramBenefitsOverviewProps";
import IProgramBenefitsOverviewState, { } from "./IProgramBenefitsOverviewState";
import BenefitsOverview from "prosjektportalen/lib/WebParts/BenefitsOverview";
import DataSource, { IDataSourceSearchCustom } from "prosjektportalen/lib/WebParts/DataSource";
import NoStoredProjectsMessage from "../@Components/NoStoredProjectsMessage";
import * as common from "../../@Common";
//#endregion

export default class ProgramBenefitsOverview extends React.Component<IProgramBenefitsOverviewProps, IProgramBenefitsOverviewState> {
    public static displayName = "ProgramBenefitsOverview";
    public static defaultProps = ProgramBenefitsOverviewDefaultProps;

    /**
     * Constructor
     *
     * @param {IProgramBenefitsOverviewProps} props Props
     */
    constructor(props: IProgramBenefitsOverviewProps) {
        super(props);
        this.state = { isLoading: true };
    }

    public async componentDidMount() {
        try {
            const searchSettings = await this.buildSearchSettingsFromStoredProjects();
            this.setState({ searchSettings, isLoading: false });
        } catch (errorMessage) {
            this.setState({ errorMessage, isLoading: false  });
        }
    }

    public render() {
        if (this.state.isLoading) {
            return null;
        }
        if (this.state.errorMessage) {
            return <MessageBar messageBarType={MessageBarType.error}>{this.state.errorMessage}</MessageBar>;
        }
        if (this.state.searchSettings === null) {
            return <NoStoredProjectsMessage />;
        }
        return (
            <BenefitsOverview
                dataSource={DataSource.SearchCustom}
                customSearchSettings={this.state.searchSettings} />
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
            const searchQuery = items.map(({ URL }) => `Path:${URL}`).join(" OR ");
            return {
                RowLimit: 500,
                QueryTemplate: String.format(this.props.queryTemplate, searchQuery),
            };
        } catch (err) {
            throw err;
        }
    }
}

export {
    IProgramBenefitsOverviewProps,
    IProgramBenefitsOverviewState,
};
