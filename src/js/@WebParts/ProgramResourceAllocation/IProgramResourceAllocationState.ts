import { IDataSourceSearchCustom } from "prosjektportalen/lib/WebParts/DataSource";

export interface IProgramResourceAllocationState {
    isLoading: boolean;
    errorMessage?: string;
    searchSettings?: IDataSourceSearchCustom;
    rootUrl?: string;
}
