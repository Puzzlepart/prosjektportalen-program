import { IDataSourceSearchCustom } from "prosjektportalen/lib/WebParts/DataSource";
import { Web } from "@pnp/sp";

export interface IProgramResourceAllocationState {
    isLoading: boolean;
    errorMessage?: string;
    searchSettings?: IDataSourceSearchCustom;
    rootWeb?: Web;
}
