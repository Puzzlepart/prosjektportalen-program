//#region Declarations
declare function AddItemsToTimeline(itemIds: Array<{ id: string }>, listId: string, staticTimelineString: string): void;
//#endregion

//#region Imports
import * as React from "react";
import { sp, Web } from "@pnp/sp";
import { Toggle } from "office-ui-fabric-react/lib/Toggle";
import { Icon } from "office-ui-fabric-react/lib/Icon";
import { ActionButton } from "office-ui-fabric-react/lib/Button";
import { IColumn, DetailsList, SelectionMode, DetailsListLayoutMode, DetailsListBase } from "office-ui-fabric-react/lib/DetailsList";
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { IProgressIndicatorProps, ProgressIndicator } from "office-ui-fabric-react/lib/ProgressIndicator";
import IProgramProjectsTimelineSyncProps, { ProgramProjectsTimelineSyncDefaultProps } from "./IProgramProjectsTimelineSyncProps";
import IProgramProjectsTimelineSyncState, { IProgramProjectsTimelineSyncMessage } from "./IProgramProjectsTimelineSyncState";
import TimelineItem from "./TimelineItem";
import AddToTimelineResult from "./AddToTimelineResult";
import NoStoredProjectsMessage from "../@Components/NoStoredProjectsMessage";
import * as common from "../../@Common";
import * as strings from "../../strings";
import * as config from "../../config";
//#endregion

export default class ProgramProjectsTimelineSync extends React.Component<IProgramProjectsTimelineSyncProps, IProgramProjectsTimelineSyncState> {
    public static displayName = "ProgramProjectsTimelineSync";
    public static defaultProps = ProgramProjectsTimelineSyncDefaultProps;

    private storedProjectsDetailsListRef: DetailsListBase;

    /**
     * Constructor
     *
     * @param {IProgramProjectsTimelineSyncProps} props Props
     */
    constructor(props: IProgramProjectsTimelineSyncProps) {
        super(props);
        this.state = {
            isLoading: true,
            addToTimelineAutomatically: true,
            includeExpiredProjects: true,
            storedProjectsCurrentPage: 0,
            syncMessages: [],
        };
        this.syncAllToProjectsTimeline = this.syncAllToProjectsTimeline.bind(this);
        this.clearSyncMessages = this.clearSyncMessages.bind(this);
    }

    public async componentDidMount() {
        try {
            const [storedProjectsList, timelineList] = await Promise.all([
                common.getStoredProjectsListContext(),
                this.getTimelineList(),
            ]);
            this.setState({ storedProjectsList, timelineList, isLoading: false });
        } catch (errorMessage) {
            this.setState({ errorMessage, isLoading: false });
        }
    }

    public render() {
        if (this.state.isLoading) {
            return <Spinner size={SpinnerSize.large} label={strings.ProgramProjectsTimelineSync_LoadingText} />;
        }
        if (this.state.errorMessage) {
            return <MessageBar messageBarType={MessageBarType.error}>{this.state.errorMessage}</MessageBar>;
        }
        return (
            <div>
                {this.renderStoredProjectsList()}
                {this.renderLogList()}
            </div>
        );
    }

    /**
     * Get paging state for stored projects list
     */
    private getStoredProjectsListContextPagingState() {
        const pagingEnabled = this.props.hasOwnProperty("storedProjectsItemsPerPage");
        let { items } = this.state.storedProjectsList;
        let totalCount = items.length;
        let currentPage = this.state.storedProjectsCurrentPage;
        let itemsPerPage = this.props.storedProjectsItemsPerPage;
        let pageCount = Math.ceil(totalCount / itemsPerPage);
        let startItemIndex;
        let endItemIndex;
        let isLastPage = currentPage === (pageCount - 1);
        if (pagingEnabled) {
            startItemIndex = itemsPerPage * currentPage;
            endItemIndex = startItemIndex + itemsPerPage;
            if (isLastPage) {
                endItemIndex = totalCount - 1;
            }
            items = [].concat(this.state.storedProjectsList.items).splice(startItemIndex, this.props.storedProjectsItemsPerPage);
        }
        return { pagingEnabled, currentPage, items, startItemIndex, endItemIndex, isLastPage, totalCount };
    }

    /**
     * Render stored projects list
     */
    private renderStoredProjectsList() {
        const pagingState = this.getStoredProjectsListContextPagingState();
        return (
            <div>
                <h2 style={{ marginBottom: 20 }}>{strings.ProgramProjectsTimelineSync_StoredProjectsListHeader}</h2>
                {this.state.storedProjectsList.items.length === 0
                    ? <NoStoredProjectsMessage />
                    : (
                        <div>
                            <div style={{ maxWidth: 750 }}>
                                <div style={{ paddingBottom: 10 }} hidden={pagingState.pagingEnabled}>
                                    <MessageBar>{String.format(strings.ProgramProjectsTimelineSync_CountText, pagingState.totalCount)}</MessageBar>
                                </div>
                                {this.state.syncProgress
                                    ? (
                                        <div>
                                            <ProgressIndicator {...this.state.syncProgress} />
                                        </div>
                                    )
                                    : (
                                        <div>
                                            <div>
                                                <ActionButton
                                                    text={strings.ProgramProjectsTimelineSync_SyncAllToTimeline}
                                                    iconProps={{ iconName: "Sync" }}
                                                    style={{ margin: 0 }}
                                                    onClick={this.syncAllToProjectsTimeline} />
                                            </div>
                                            <div>
                                                <Toggle
                                                    label={strings.ProgramProjectsTimelineSync_AddToTimelineAutomatically}
                                                    onText={strings.Yes}
                                                    offText={strings.No}
                                                    defaultChecked={this.state.addToTimelineAutomatically}
                                                    onChanged={addToTimelineAutomatically => this.setState({ addToTimelineAutomatically })} />
                                            </div>
                                            <div hidden={!this.state.addToTimelineAutomatically}>
                                                <Toggle
                                                    label={strings.ProgramProjectsTimelineSync_IncludeExpiredProjects}
                                                    onText={strings.Yes}
                                                    offText={strings.No}
                                                    defaultChecked={this.state.includeExpiredProjects}
                                                    onChanged={includeExpiredProjects => this.setState({ includeExpiredProjects })} />
                                            </div>
                                        </div>
                                    )}
                            </div>
                            <div hidden={!!this.state.syncProgress}>
                                <div hidden={!pagingState.pagingEnabled}>
                                    <MessageBar>{String.format(strings.ProgramProjectsTimelineSync_PagingStatusText, pagingState.startItemIndex + 1, pagingState.endItemIndex + 1, pagingState.totalCount)}</MessageBar>
                                    <div style={{ marginTop: 10, height: 50 }}>
                                        <ActionButton
                                            text={strings.PreviousPage}
                                            iconProps={{ iconName: "Previous" }}
                                            onClick={e => this.setState({ storedProjectsCurrentPage: pagingState.currentPage - 1 })}
                                            disabled={pagingState.currentPage === 0}
                                            style={{ float: "left" }} />
                                        <ActionButton
                                            text={strings.NextPage}
                                            iconProps={{ iconName: "Next" }}
                                            onClick={e => this.setState({ storedProjectsCurrentPage: pagingState.currentPage + 1 })}
                                            disabled={pagingState.isLastPage}
                                            style={{ float: "right" }} />
                                    </div>
                                </div>
                                <DetailsList
                                    items={pagingState.items}
                                    columns={this.props.storedProjectsColumns}
                                    onRenderItemColumn={this.storedProjectsOnRenderItemColumn}
                                    layoutMode={DetailsListLayoutMode.justified}
                                    selectionMode={SelectionMode.none} />
                            </div>
                        </div>
                    )}
            </div>
        );
    }

    /**
     * Render log list
     */
    private renderLogList() {
        return (
            <div>
                <h2 style={{ marginTop: 50, marginBottom: 20 }}>{strings.ProgramProjectsTimelineSync_LogListHeader}</h2>
                {this.state.syncMessages.length === 0
                    ? <MessageBar>{strings.ProgramProjectsTimelineSync_EmptyLog}</MessageBar>
                    : <div>
                        <ActionButton
                            text={strings.ProgramProjectsTimelineSync_DeleteLog}
                            iconProps={{ iconName: "Delete" }}
                            style={{ margin: 0 }}
                            onClick={this.clearSyncMessages} />
                        <DetailsList
                            items={this.state.syncMessages}
                            columns={this.props.syncMessagesColumns}
                            onRenderItemColumn={this.logListOnRenderItemColumn}
                            layoutMode={DetailsListLayoutMode.justified}
                            selectionMode={SelectionMode.none} />
                    </div>
                }
            </div>
        );
    }

    /**
     * Render item column in stored projects list
     *
     * @param {common.ProjectItem} project Project
     * @param {number} index Index
     * @param {IColumn} column Column
     */
    private storedProjectsOnRenderItemColumn = (project: common.ProjectItem, index: number, column: IColumn) => {
        const columnValue = project[column.fieldName];
        switch (column.fieldName) {
            case "Title": {
                return <a target="_blank" href={project.URL}>{columnValue}</a>;
            }
            case "SyncButton": {
                return (
                    <ActionButton
                        key={`SyncButton_${index}`}
                        data-automation-id={`SyncButton_${index}`}
                        text={strings.ProgramProjectsTimelineSync_SyncToTimeline}
                        iconProps={{ iconName: "Refresh" }}
                        onClick={e => this.syncToProjectsTimelineList(project)} />
                );
            }
            case "RemoveButton": {
                return (
                    <ActionButton
                        key={`RemoveButton_${index}`}
                        data-automation-id={`RemoveButton_${index}`}
                        text={strings.ProgramProjectsTimelineSync_RemoveFromProgram}
                        iconProps={{ iconName: "Delete" }}
                        onClick={e => this.removeProjectFromProgram(project)} />
                );
            }
            default: {
                return <span>{columnValue}</span>;
            }
        }
    }

    /**
     * Render item column in log list
     *
     * @param {IProgramProjectsTimelineSyncMessage} syncMessage Sync message
     * @param {number} index Index
     * @param {IColumn} column Column
    */
    private logListOnRenderItemColumn = (syncMessage: IProgramProjectsTimelineSyncMessage, index: number, column: IColumn) => {
        const columnValue = syncMessage[column.fieldName];
        switch (column.fieldName) {
            case "icon": {
                return (
                    <div>
                        <Icon iconName={syncMessage.iconName} />
                        <span>{columnValue}</span>
                    </div>
                );
            }
            default: {
                return <span>{columnValue}</span>;
            }
        }
    }


    /**
    * Sync project to timeline using global function AddItemsToTimeline
    *
    * @param {TimelineItem} timelineItem item
    */
    private addToTimeline(timelineItem: TimelineItem): AddToTimelineResult {
        if (this.state.addToTimelineAutomatically) {
            const canBeAddedToTimeline = timelineItem.StartDate || timelineItem.DueDate;
            if (canBeAddedToTimeline) {
                const isExpired = (timelineItem.DueDate && new Date(timelineItem.DueDate).getTime() < new Date().getTime());
                if (isExpired && !this.state.includeExpiredProjects) {
                    return AddToTimelineResult.Expired;
                }
                const id = `${timelineItem.ID}`;
                AddItemsToTimeline([{ id }], this.state.timelineList.properties.Id, "Timeline");
                return AddToTimelineResult.Success;
            } else {
                return AddToTimelineResult.NoDates;
            }
        }
        return AddToTimelineResult.NotEnabled;
    }

    /**
     * Remove project from list
     *
     * @param {common.ProjectItem} projectToRemove Project to sync
     */
    private async removeProjectFromProgram(projectToRemove: common.ProjectItem): Promise<void> {
        try {
            await this.state.storedProjectsList.list.items.getById(projectToRemove.ListItemId).delete();
            const items = this.state.storedProjectsList.items.filter(p => p.ListItemId !== projectToRemove.ListItemId);
            this.setState({
                storedProjectsList: {
                    ...this.state.storedProjectsList,
                    items,
                },
            });
            this.addSyncMessage(String.format(strings.ProgramProjectsTimelineSync_ProjectRemoved, projectToRemove.Title), "Delete");
        } catch (err) {
            throw err;
        }
    }

    /**
     * Sync project to timeline
     *
     * @param {common.ProjectItem} project Project
     */
    private async getProjectProperties(project: common.ProjectItem) {
        try {
            const projectWeb = new Web(project.URL);
            const projectWebSitePages = await projectWeb.lists.getByTitle("Properties").getItemsByCAMLQuery({ ViewXml: "<View></View>" });
            const [projectProperties] = projectWebSitePages.filter(page => page.ContentTypeId.indexOf("0x010088578E7470CC4AA68D5663464831070211") !== -1);
            return projectProperties;
        } catch {
            throw String.format(strings.ProgramProjectsTimelineSync_ProjectDoesNotExist, project.Title);
        }
    }

    /**
    * Get date values to sync
    *
    * @param {any} projectProperties Project properties
    * @param {TimelineItem} timelineItem item
    */
    private getDateValuesToSync(projectProperties, timelineItem): Partial<TimelineItem> {
        const timelineDateValuesSyncMapKeys = Object.keys(this.props.timelineDateValuesSyncMap);
        const valuesToSync: Partial<TimelineItem> = timelineDateValuesSyncMapKeys.reduce((obj, fieldKey) => {
            const sourceFieldKey = this.props.timelineDateValuesSyncMap[fieldKey];
            const newValue = projectProperties[sourceFieldKey];
            if (newValue) {
                obj[fieldKey] = newValue;
            }
            return obj;
        }, {});
        return valuesToSync;
    }

    /**
     * Sync project to timeline
     *
     * @param {common.ProjectItem} projectToSync Project to sync
     */
    private async syncToProjectsTimelineList(projectToSync: common.ProjectItem): Promise<void> {
        try {
            let { list, properties, items } = this.state.timelineList;
            const projectProperties = await this.getProjectProperties(projectToSync);
            let [timelineItem] = items.filter(i => i.URL !== null && i.URL.Url === projectToSync.URL);
            const dateValuesToSync = this.getDateValuesToSync(projectProperties, timelineItem);
            let itemProperties: TimelineItem = { ...dateValuesToSync, Title: projectToSync.Title, URL: { Url: projectToSync.URL, Description: projectToSync.Title } };

            if (projectProperties.GtProjectPhase && projectProperties.GtProjectPhase.Label) {
                itemProperties.Title = `${projectToSync.Title} (${projectProperties.GtProjectPhase.Label})`;
            }


            if (timelineItem) {
                /** Updating existing item */
                const itemId = timelineItem.ID;
                try {
                    await list.items.getById(itemId).update(itemProperties);
                    await this.state.storedProjectsList.list.items.getById(projectToSync.ListItemId).update({ TimelineLastSyncTime: new Date() });
                    this.addSyncMessage(String.format(strings.ProgramProjectsTimelineSync_TimelineItemUpdated, timelineItem.Title), "Refresh");
                } catch (err) {
                    this.addSyncMessage(String.format(strings.ProgramProjectsTimelineSync_TimelineItemUpdateError, timelineItem.Title), "Error");

                }
            } else {
                /** Adding item */
                const { ListItemEntityTypeFullName } = properties;
                const itemAddResult = await list.items.add(itemProperties, ListItemEntityTypeFullName);
                timelineItem = itemAddResult.data;
                await this.state.storedProjectsList.list.items.getById(projectToSync.ListItemId).update({ TimelineLastSyncTime: new Date() });
                items = items.concat([timelineItem]);
                this.setState({
                    timelineList: {
                        ...this.state.timelineList,
                        items,
                    },
                });
                this.addSyncMessage(String.format(strings.ProgramProjectsTimelineSync_TimelineItemAdded, timelineItem.Title), "NewTeamProject");
            }

            /** Add to timeline */
            const addToTimelineRsult = this.addToTimeline(timelineItem);
            switch (addToTimelineRsult) {
                case AddToTimelineResult.Success: this.addSyncMessage(String.format(strings.ProgramProjectsTimelineSync_TimelineItemAddedToTimeline, timelineItem.Title), "Timeline");
                    break;
                case AddToTimelineResult.Expired: this.addSyncMessage(String.format(strings.ProgramProjectsTimelineSync_TimelineItemExpired, timelineItem.Title), "EventDate");
                    break;
                case AddToTimelineResult.NoDates: this.addSyncMessage(String.format(strings.ProgramProjectsTimelineSync_TimelineItemNoDates, timelineItem.Title), "Warning");
                    break;
            }
        } catch (err) {
            this.addSyncMessage(err, "Error");
        }
    }

    /**
     * Sync all projects to timeline
     */
    private async syncAllToProjectsTimeline(): Promise<void> {
        this.storedProjectsDetailsListRef.forceUpdate();
        const { items } = this.state.storedProjectsList;
        for (let i = 0; i < items.length; i++) {
            const syncProgress: IProgressIndicatorProps = {};
            syncProgress.percentComplete = (i / items.length);
            syncProgress.description = String.format(strings.ProgramProjectsTimelineSync_SyncingToTimeline, items[i].Title);
            syncProgress.label = String.format(strings.ProgramProjectsTimelineSync_SyncingAllToTimeline, Math.floor(syncProgress.percentComplete * 100));
            this.setState({ syncProgress });
            await this.syncToProjectsTimelineList(items[i]);
        }
        this.setState({ syncProgress: null });
        this.storedProjectsDetailsListRef.forceUpdate();
    }

    /**
     * Checks if the list exists in the current web
     */
    private async getTimelineList(): Promise<common.IListContext<any>> {
        try {
            const list = sp.web.lists.getByTitle(config.Lists_ProjectsTimeline_Title);
            const [items, properties] = await Promise.all([
                list.items.get(),
                list.select("Id", "ListItemEntityTypeFullName").get(),
            ]);
            return { list, properties, items };
        } catch (err) {
            throw strings.Lists_StoredProjects_DoesNotExist;
        }
    }

    /**
     * Add sync message to log list
     *
     * @param {string} message Message
     * @param {string} iconName Icon name
     */
    private addSyncMessage(message: string, iconName: string): void {
        const timeStamp = common.getTimestamp();
        this.setState({ syncMessages: [{ message, timeStamp, iconName }].concat(this.state.syncMessages || []) });
    }

    /**
     * Clear sync messages from log list
     */
    private clearSyncMessages() {
        this.setState({ syncMessages: [] });
    }
}

export {
    IProgramProjectsTimelineSyncProps,
    IProgramProjectsTimelineSyncState,
};
