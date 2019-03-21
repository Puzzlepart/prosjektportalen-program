import { IDataSourceSearchCustom } from "prosjektportalen/lib/WebParts/DataSource";

export interface IProgramDeliveriesOverviewState {
    isLoading: boolean;
    errorMessage?: string;
    searchSettings?: IDataSourceSearchCustom;
}
