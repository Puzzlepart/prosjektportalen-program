
import { IDynamicPortfolioViewConfig } from "prosjektportalen/lib/WebParts/DynamicPortfolio/DynamicPortfolioConfiguration";

export default interface IProgramPortfolioState {
    isLoading: boolean;
    errorMessage?: string;
    view?: IDynamicPortfolioViewConfig;
}
