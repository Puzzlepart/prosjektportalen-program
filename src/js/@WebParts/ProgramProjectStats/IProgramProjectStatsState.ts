import { ProjectItem } from "src/js/@Common";
import { Web } from "@pnp/sp";
import { IDataSourceSearchCustom } from "prosjektportalen/lib/WebParts/DataSource";

export interface IProgramProjectStatsState {
    isLoading: boolean;
    errorMessage?: string;
    rootWeb?: Web;
    items?: ProjectItem[];
    searchSettings?: IDataSourceSearchCustom;
}
