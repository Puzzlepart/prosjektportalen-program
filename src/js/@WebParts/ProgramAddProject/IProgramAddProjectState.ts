import { IProgressIndicatorProps } from "office-ui-fabric-react/lib/ProgressIndicator";
import * as common from "../../@Common";

export default interface IProgramAddProjectState {
    isLoading: boolean;
    isSearching: boolean;
    projects: common.ProjectItem[];
    statusMessages: common.IStatusMessage[];
    storedProjectsList?: common.IListContext<common.ProjectItem>;
    errorMessage?: string;
    addProgress?: IProgressIndicatorProps;
}
