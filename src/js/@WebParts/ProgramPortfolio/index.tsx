//#region Imports
import * as React from "react";
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import IProgramPortfolioProps, { ProgramPortfolioDefaultProps } from "./IProgramPortfolioProps";
import IProgramPortfolioState, { } from "./IProgramPortfolioState";
import DynamicPortfolio from "prosjektportalen/lib/WebParts/DynamicPortfolio";
import { IDynamicPortfolioViewConfig } from "prosjektportalen/lib/WebParts/DynamicPortfolio/DynamicPortfolioConfiguration";
import NoStoredProjectsMessage from "../@Components/NoStoredProjectsMessage";
import * as common from "../../@Common";
import * as strings from "../../strings";
//#endregion

export default class ProgramPortfolio extends React.Component<IProgramPortfolioProps, IProgramPortfolioState> {
    public static displayName = "ProgramPortfolio";
    public static defaultProps = ProgramPortfolioDefaultProps;

    /**
     * Constructor
     *
     * @param {IProgramPortfolioProps} props Props
     */
    constructor(props: IProgramPortfolioProps) {
        super(props);
        this.state = { isLoading: true };
    }

    public async componentDidMount() {
        try {
            const view = await this.buildViewFromStoredProjects();
            this.setState({ view, isLoading: false });
        } catch (errorMessage) {
            this.setState({ errorMessage, isLoading: false });
        }
    }

    /**
     * Renders the <ProgramPortfolio /> component
     */
    public render(): React.ReactElement<IProgramPortfolioProps> {
        const { isLoading, errorMessage, view } = this.state;
        if (isLoading) {
            return null;
        }
        if (errorMessage) {
            return <MessageBar messageBarType={MessageBarType.error}>{this.state.errorMessage}</MessageBar>;
        }
        if (view === null) {
            return <NoStoredProjectsMessage />;
        }
        return (
            <DynamicPortfolio
                defaultView={view}
                viewSelectorEnabled={false}
                searchBoxLabelText={strings.ProgramPortfolio_SearchBoxLabelText}
                showCountText={strings.ProgramPortfolio_ShowCountText}
                loadingText={strings.ProgramPortfolio_LoadingText} />
        );
    }

    /**
     * Build search query from items in stored projects list
     */
    private async buildViewFromStoredProjects(): Promise<IDynamicPortfolioViewConfig> {
        try {
            const { fields, refiners } = this.props;
            const { items } = await common.getStoredProjectsListContext();
            if (items.length === 0) {
                return null;
            }
            const searchQuery = items.map(({ URL }) => `Path:${URL}`).join(" OR ");
            const queryTemplate = String.format(this.props.queryTemplate, searchQuery);
            return { fields, refiners, queryTemplate };
        } catch (err) {
            throw err;
        }
    }
}

export {
    IProgramPortfolioProps,
    IProgramPortfolioState,
};
