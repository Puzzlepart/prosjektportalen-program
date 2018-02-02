import { IProgressIndicatorProps } from "office-ui-fabric-react/lib/ProgressIndicator";
import { ProjectItem } from "../../@Common";
import EnrichedProjectItem from "./EnrichedProjectItem";

export default interface IProgramProjectStatusState {
    isLoading: boolean;
    enrichedProjects?: EnrichedProjectItem[];
    failedProjects?: ProjectItem[];
    errorMessage?: string;
    loadProgress?: IProgressIndicatorProps;
}
