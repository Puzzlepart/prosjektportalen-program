import { IDataSourceSearchCustom } from "prosjektportalen/lib/WebParts/DataSource";

export default interface IProgramBenefitsOverviewState {
    isLoading: boolean;
    errorMessage?: string;
    searchSettings?: IDataSourceSearchCustom;
}
