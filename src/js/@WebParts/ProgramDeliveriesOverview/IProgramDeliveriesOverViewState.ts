import { IDataSourceSearchCustom } from "prosjektportalen/lib/WebParts/DataSource";

export default interface IProgramDeliveriesOverviewState {
    isLoading: boolean;
    errorMessage?: string;
    searchSettings?: IDataSourceSearchCustom;
}
