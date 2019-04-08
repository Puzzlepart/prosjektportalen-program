import { ProjectItem } from "src/js/@Common";
import { IDataSourceSearchCustom } from "prosjektportalen/lib/WebParts/DataSource";

export interface IProgramProjectStatsState {
    isLoading: boolean;
    errorMessage?: string;
    items?: ProjectItem[];
    searchSettings?: IDataSourceSearchCustom;
}
