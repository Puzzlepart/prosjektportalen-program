//#region Imports
import * as React from "react";
import pnp from "sp-pnp-js";
import { IProgressIndicatorProps, ProgressIndicator } from "office-ui-fabric-react/lib/ProgressIndicator";
import { ActionButton } from "office-ui-fabric-react/lib/Button";
import { IColumn, DetailsList, SelectionMode, DetailsListLayoutMode } from "office-ui-fabric-react/lib/DetailsList";
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { SearchBox } from "office-ui-fabric-react/lib/SearchBox";
import IProgramAddProjectProps, { ProgramAddProjectDefaultProps } from "./IProgramAddProjectProps";
import IProgramAddProjectState from "./IProgramAddProjectState";
import AddProjectToProgramResult from "./AddProjectToProgramResult";
import * as common from "../../@Common";
import * as strings from "../../strings";
import * as config from "../../config";
//#endregion

export default class ProgramAddProject extends React.Component<IProgramAddProjectProps, IProgramAddProjectState> {
    public static displayName = "ProgramAddProject";
    public static defaultProps = ProgramAddProjectDefaultProps;

    private projectsDetailsListRef: DetailsList;
    private searchDelayTimer;

    /**
     * Constructor
     *
     * @param {IProgramAddProjectProps} props Props
     */
    constructor(props: IProgramAddProjectProps) {
        super(props);
        this.state = {
            isLoading: true,
            isSearching: false,
            projects: [],
            statusMessages: [],
        };
        this.searchDelayTimer = window.setTimeout(null, 0);
        this.addAllProjectsToProgram = this.addAllProjectsToProgram.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    public async componentDidMount() {
        try {
            const storedProjectsList = await common.getStoredProjectsListContext(config.Lists_StoredProjects_ItemsMaxLimit - 1);
            this.setState({
                storedProjectsList,
                isLoading: false,
            });
        } catch (errorMessage) {
            this.setState({
                errorMessage,
                isLoading: false,
            });
        }
    }

    public render() {
        if (this.state.isLoading) {
            return null;
        }
        if (this.state.errorMessage) {
            return <MessageBar messageBarType={MessageBarType.error}>{this.state.errorMessage}</MessageBar>;
        }
        return (
            <div>
                {this.renderSearchBox()}
                {this.state.projects.length === 0
                    ? <MessageBar>{strings.ProgramAddProject_EmptyMessage}</MessageBar>
                    :
                    <div>
                        {this.renderStatusBar()}
                        {this.renderActionBar()}
                        {this.renderProjectsList()}
                    </div>
                }
            </div>
        );
    }

    private renderSearchBox() {
        return (
            <div style={{ marginBottom: 10 }}>
                <SearchBox
                    labelText={strings.ProgramAddProject_SearchBoxLabelText}
                    onChange={this.onSearch}
                    disabled={!!this.state.addProgress} />
            </div>
        );
    }

    /**
     * Render status bar
     */
    private renderStatusBar() {
        return (
            <div style={{ paddingBottom: 10 }}>
                {this.state.statusMessages.map(sm => (
                    <div style={{ marginBottom: 5 }}>
                        <MessageBar messageBarType={sm.type}>{sm.text}</MessageBar>
                    </div>
                ))}
            </div>
        );
    }

    /**
     * Render action bar
     */
    private renderActionBar() {
        if (this.state.isSearching) {
            return (
                <div style={{ maxWidth: 750, paddingBottom: 10 }}>
                    <Spinner size={SpinnerSize.large} />
                </div>
            );
        }
        return (
            <div style={{ maxWidth: 750, paddingBottom: 10 }}>
                {this.state.addProgress
                    ? <ProgressIndicator { ...this.state.addProgress } />
                    : (
                        <div hidden={this.state.projects.length < 2}>
                            <ActionButton
                                text={String.format(strings.ProgramAddProject_AddAllProjectsToProgram, this.state.projects.length)}
                                iconProps={{ iconName: "AddEvent" }}
                                style={{ margin: 0 }}
                                onClick={this.addAllProjectsToProgram} />
                        </div>
                    )}
            </div>
        );
    }

    /**
     * Render projects list
     */
    private renderProjectsList() {
        return (
            <div hidden={!!this.state.addProgress}>
                <DetailsList
                    ref={ele => this.projectsDetailsListRef = ele}
                    items={this.state.projects}
                    columns={this.props.columns}
                    onRenderItemColumn={this.onRenderItemColumn}
                    layoutMode={DetailsListLayoutMode.justified}
                    selectionMode={SelectionMode.none} />
            </div>
        );
    }

    /**
     * Render item column in details list
     *
     * @param {common.ProjectItem} project Project
     * @param {number} index Index
     * @param {IColumn} column Column
     */
    private onRenderItemColumn = (project: common.ProjectItem, index: number, column: IColumn) => {
        const columnValue = project[column.fieldName];
        switch (column.fieldName) {
            case "Title": {
                return <a target="_blank" href={project.URL}>{columnValue}</a>;
            }
            case "AddButton": {
                if (this.isProjectInList(project)) {
                    return <span>{strings.ProgramAddProject_ProjectAlreadyInProgram}</span>;
                }
                return (
                    <ActionButton
                        key={`AddButton_${index}`}
                        data-automation-id={`AddButton_${index}`}
                        text={strings.ProgramAddProject_AddProjectToProgram}
                        iconProps={{ iconName: "AddEvent" }}
                        style={{ margin: 0 }}
                        onClick={e => this.addProjectToProgram(project)} />
                );
            }
            default: {
                return <span>{columnValue}</span>;
            }
        }
    }

    /**
     * Checks if project is in list
     *
     * @param {common.ProjectItem} project Project to check for
     */
    private isProjectInList(project: common.ProjectItem): boolean {
        const { items } = this.state.storedProjectsList;
        return items.filter(sp => sp.URL === project.URL).length > 0;
    }

    /**
     * Add all projects to program
     */
    private async addAllProjectsToProgram(): Promise<Array<{ project: common.ProjectItem, result: AddProjectToProgramResult }>> {
        const { projects } = this.state;
        const projectsNotStored = projects.filter(p => !this.isProjectInList(p));
        let addResults: Array<{ project: common.ProjectItem, result: AddProjectToProgramResult }> = [];
        if (projectsNotStored.length === 0) {
            this.addStatusMessage({
                text: strings.ProgramAddProject_ProjectsAlreadyInProgram,
                type: MessageBarType.warning,
            });
            return;
        }
        for (let i = 0; i < projectsNotStored.length; i++) {
            // Updating progress
            const addProgress: IProgressIndicatorProps = {};
            addProgress.percentComplete = (i / projectsNotStored.length);
            addProgress.description = String.format(strings.ProgramAddProject_AddingProjectToProgramDescription, projectsNotStored[i].Title);
            addProgress.label = String.format(strings.ProgramAddProject_AddingProjectToProgram, Math.floor(addProgress.percentComplete * 100));
            this.setState({ addProgress });

            // Adding project to program
            const addResult = await this.addProjectToProgram(projectsNotStored[i], false, false);
            addResults.push({ project: projectsNotStored[i], result: addResult });
            if (addResult === AddProjectToProgramResult.LimitReached) {
                this.addStatusMessage({
                    text: String.format(strings.Lists_StoredProjects_MaxLimitError, this.state.storedProjectsList.items.length, config.Lists_StoredProjects_ItemsMaxLimit),
                    type: MessageBarType.error,
                });
                break;
            }
        }
        this.setState({ addProgress: null });
        this.projectsDetailsListRef.forceUpdate();
        const projectsAddedString = addResults.filter(({ result }) => result === AddProjectToProgramResult.Success).map(({ project }) => project.Title).join(", ");
        const projectsAddedCount = addResults.filter(({ result }) => result === AddProjectToProgramResult.Success).length;
        if (projectsAddedCount > 0) {
            this.addStatusMessage({
                text: String.format(strings.ProgramAddProject_ProjectsWasAddedToProgram, projectsAddedCount, projectsAddedString),
                type: MessageBarType.success,
            });
        }

        return addResults;
    }

    /**
     * Add project to list
     *
     * @param {common.ProjectItem} projectToAdd Project to add to the list
     * @param {boolean} addStatusMessage Add status message to UI (defaults to true)
     * @param {boolean} forceUpdate Should the details list be force-updated (defaults to true)
     */
    private async addProjectToProgram(projectToAdd: common.ProjectItem, addStatusMessage = true, forceUpdate = true): Promise<AddProjectToProgramResult> {
        const { list, properties: { ListItemEntityTypeFullName }, items } = this.state.storedProjectsList;
        if (items.length >= config.Lists_StoredProjects_ItemsMaxLimit) {
            if (addStatusMessage) {
                this.addStatusMessage({
                    text: String.format(strings.Lists_StoredProjects_MaxLimitError, this.state.storedProjectsList.items.length, config.Lists_StoredProjects_ItemsMaxLimit),
                    type: MessageBarType.error,
                });
            }
            return AddProjectToProgramResult.LimitReached;
        }
        try {
            await list.items.add({ URL: { Url: projectToAdd.URL, Description: projectToAdd.Title } }, ListItemEntityTypeFullName);
        } catch {
            return AddProjectToProgramResult.Failed;
        }
        this.setState({
            storedProjectsList: {
                ...this.state.storedProjectsList,
                items: [
                    ...items,
                    projectToAdd,
                ],
            },
        });
        if (addStatusMessage) {
            this.addStatusMessage({
                text: String.format(strings.ProgramAddProject_ProjectWasAddedToProgram, projectToAdd.Title),
                type: MessageBarType.success,
            });
        }
        if (forceUpdate) {
            this.projectsDetailsListRef.forceUpdate();
        }
        return AddProjectToProgramResult.Success;
    }

    /**
     * Add status message
     *
     * @param {common.IStatusMessage} statusMessage Status message
     * @param {number} durationMs Duration in miliseconds (defaults to 5000 ms)
     */
    private addStatusMessage(statusMessage: common.IStatusMessage, durationMs = 5000): void {
        const generatedStatusId = common.getRandomArbitrary(1, 1000);
        this.setState(prevState => ({ statusMessages: [...prevState.statusMessages, { id: generatedStatusId, ...statusMessage }] }));
        statusMessage.timer = window.setTimeout(() => {
            this.setState(prevState => ({ statusMessages: prevState.statusMessages.filter(sm => sm.id !== generatedStatusId) }));
        }, durationMs);
    }

    /**
     * On key down in search box
     *
     * @param {string} searchTerm Search term
     * @param {number} minLength Search term min length before executing a search
     */
    private async onSearch(searchTerm: string, minLength = 3): Promise<void> {
        if (searchTerm.length < minLength) {
            return;
        }
        this.setState({ isSearching: true });
        window.clearTimeout(this.searchDelayTimer);
        this.searchDelayTimer = window.setTimeout(async () => {
            const projects = await this.queryProjects(searchTerm);
            this.setState({ projects, isSearching: false, statusMessages: [] });
        }, 250);
    }

    /**
     * Retrieves projects matching the searchTerm
     *
     * @param {string} searchTerm Search term
     */
    private async queryProjects(searchTerm: string): Promise<common.ProjectItem[]> {
        try {
            const { PrimarySearchResults } = await pnp.sp.search({
                Querytext: "*",
                QueryTemplate: `${this.props.projectsSearchQuery} Title:${searchTerm}*`,
                RowLimit: this.props.rowLimit,
                TrimDuplicates: false,
                SelectProperties: ["Title", "Path"],
            });
            return PrimarySearchResults.map(sr => new common.ProjectItem(-1, sr.Title, sr.Path));
        } catch (err) {
            throw err;
        }
    }
}

export {
    IProgramAddProjectProps,
    IProgramAddProjectState,
};
