import { IDataSourceSearchCustom } from "prosjektportalen/lib/WebParts/DataSource";

export default interface IProgramExperienceLogState {
    isLoading: boolean;
    errorMessage?: string;
    searchSettings?: IDataSourceSearchCustom[];
}
