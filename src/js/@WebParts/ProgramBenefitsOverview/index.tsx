//#region Imports
import * as React from "react";
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import IProgramBenefitsOverviewProps, { ProgramBenefitsOverviewDefaultProps } from "./IProgramBenefitsOverviewProps";
import IProgramBenefitsOverviewState, { } from "./IProgramBenefitsOverviewState";
import BenefitsOverview from "prosjektportalen/lib/WebParts/BenefitsOverview";
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
            const queryTemplate = await this.buildQueryTemplateStoredProjects();
            this.setState({ queryTemplate, isLoading: false });
        } catch (errorMessage) {
            this.setState({ errorMessage, isLoading: false });
        }
    }

    public render() {
        if (this.state.errorMessage) {
            return (
                <>
                    <h2>Gevinstoversikt</h2>
                    <MessageBar messageBarType={MessageBarType.error}>{this.state.errorMessage}</MessageBar>
                </>
            );
        }
        if (this.state.queryTemplate === null) {
            return (
                <>
                    <h2>Gevinstoversikt</h2>
                    <NoStoredProjectsMessage />
                </>
            );
        }
        return (
            <>
                <h2>Gevinstoversikt</h2>
                {(!this.state.isLoading) &&
                    <BenefitsOverview
                        queryTemplate={this.state.queryTemplate}
                        excelExportEnabled={this.props.excelExportEnabled} />}
            </>
        );
    }

    /**
     * Build search query from items in stored projects list
     */
    private async buildQueryTemplateStoredProjects(): Promise<string> {
        try {
            const { items } = await common.getStoredProjectsListContext();
            if (items.length === 0) {
                return null;
            }
            const searchQuery = items.map(({ URL }) => `Path:"${URL}"`).join(" OR ");
            return String.format(this.props.queryTemplate, searchQuery);
        } catch (err) {
            throw err;
        }
    }
}

export { IProgramBenefitsOverviewProps, IProgramBenefitsOverviewState };
