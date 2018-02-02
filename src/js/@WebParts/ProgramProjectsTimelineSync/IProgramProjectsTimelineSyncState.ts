import { IProgressIndicatorProps } from "office-ui-fabric-react/lib/ProgressIndicator";
import * as common from "../../@Common";

export interface IProgramProjectsTimelineSyncMessage {
    message: string;
    timeStamp: string;
    iconName: string;
}

export default interface IProgramProjectsTimelineSyncState {
    isLoading: boolean;
    syncMessages: IProgramProjectsTimelineSyncMessage[];
    storedProjectsList?: common.IListContext<common.ProjectItem>;
    storedProjectsCurrentPage?: number;
    timelineList?: common.IListContext<any>;
    errorMessage?: string;
    syncProgress?: IProgressIndicatorProps;
    addToTimelineAutomatically?: boolean;
}

