import * as React from "react";
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import IProgramPortfolioProps from "./IProgramPortfolioProps";
import IProgramPortfolioState, { } from "./IProgramPortfolioState";
import DynamicPortfolio from "prosjektportalen/lib/WebParts/DynamicPortfolio";
import NoStoredProjectsMessage from "../@Components/NoStoredProjectsMessage";
import * as common from "../../@Common";
import * as strings from "../../strings";

export default class ProgramPortfolio extends React.Component<IProgramPortfolioProps, IProgramPortfolioState> {
    public static displayName = "ProgramPortfolio";

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
            const queryText = await this.buildQueryFromStoredProjects();
            this.setState({ queryText, isLoading: false });
        } catch (errorMessage) {
            this.setState({ errorMessage, isLoading: false });
        }
    }

    /**
     * Renders the <ProgramPortfolio /> component
     */
    public render(): React.ReactElement<IProgramPortfolioProps> {
        const { isLoading, errorMessage, queryText } = this.state;
        if (isLoading) {
            return null;
        }
        if (errorMessage) {
            return <MessageBar messageBarType={MessageBarType.error}>{this.state.errorMessage}</MessageBar>;
        }
        if (queryText === null) {
            return <NoStoredProjectsMessage />;
        }
        return (
            <DynamicPortfolio
                queryText={queryText}
                viewConfigList="Porteføljevisninger for programmets prosjekter"
                newViewUrl="Lists/ProgramDynamicPortfolioViews/NewForm.aspx"
                searchBoxLabelText={strings.ProgramPortfolio_SearchBoxLabelText}
                showCountText={strings.ProgramPortfolio_ShowCountText}
                loadingText={strings.ProgramPortfolio_LoadingText} />
        );
    }

    /**
     * Build search query from items in stored projects list
     */
    private async buildQueryFromStoredProjects(): Promise<string> {
        try {
            const { items } = await common.getStoredProjectsListContext();
            if (items.length === 0) {
                return null;
            }
            const queryText = items.map(({ URL }) => `Path:"${URL}"`).join(" OR ");
            return queryText;
        } catch (err) {
            throw err;
        }
    }
}

export { IProgramPortfolioProps, IProgramPortfolioState };
