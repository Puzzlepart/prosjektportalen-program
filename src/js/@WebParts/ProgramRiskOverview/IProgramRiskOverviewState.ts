import { IDataSourceSearchCustom } from "prosjektportalen/lib/WebParts/DataSource";

export default interface IProgramRiskOverviewState {
    isLoading: boolean;
    errorMessage?: string;
    searchSettings?: IDataSourceSearchCustom[];
}
