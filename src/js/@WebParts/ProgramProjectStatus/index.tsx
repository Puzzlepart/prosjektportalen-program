import * as React from "react";
import { IProgressIndicatorProps, ProgressIndicator } from "office-ui-fabric-react/lib/ProgressIndicator";
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import { sp, Web } from "@pnp/sp";
import IProgramProjectStatusProps, { ProgramProjectStatusDefaultProps } from "./IProgramProjectStatusProps";
import IProgramProjectStatusState from "./IProgramProjectStatusState";
import EnrichedProjectItem from "./EnrichedProjectItem";
import { ProjectItem } from "../../@Common";
import RESOURCE_MANAGER from "prosjektportalen/lib/Resources";
import SectionModel from "prosjektportalen/lib/WebParts/ProjectStatus/Section/SectionModel";
import SummarySection from "prosjektportalen/lib/WebParts/ProjectStatus/Section/SummarySection";
import { loadJsonConfiguration } from "prosjektportalen/lib/Util";
import NoStoredProjectsMessage from "../@Components/NoStoredProjectsMessage";
import * as common from "../../@Common";
import * as strings from "../../strings";
import * as config from "../../config";

export default class ProgramProjectStatus extends React.Component<IProgramProjectStatusProps, IProgramProjectStatusState> {
    public static displayName = "ProgramProjectStatus";
    public static defaultProps = ProgramProjectStatusDefaultProps;
    private container: HTMLDivElement;

    /**
     * Constructor
     *
     * @param {IProgramProjectStatusProps} props Props
     */
    constructor(props: IProgramProjectStatusProps) {
        super(props);
        this.state = {
            isLoading: true,
            enrichedProjects: [],
            loadProgress: { label: "", description: "", percentComplete: 0 },
        };
    }

    public async componentDidMount() {
        try {
            const { items } = await common.getStoredProjectsListContext();
            if (items.length > 0) {
                const data = await this.getDataForStoredProjects(items);
                this.setState({ ...data, isLoading: false });
            } else {
                this.setState({ isLoading: false });
            }
        } catch (errorMessage) {
            this.setState({ errorMessage, isLoading: false });
        }
    }


    public render(): React.ReactElement<IProgramProjectStatusProps> {
        const {
            isLoading,
            errorMessage,
            loadProgress,
            enrichedProjects,
        } = this.state;

        if (isLoading) {
            return (
                <div ref={ele => this.container = ele} >
                    <ProgressIndicator {...loadProgress} />
                </div>
            );
        }
        if (errorMessage) {
            return (
                <div ref={ele => this.container = ele} >
                    <MessageBar messageBarType={MessageBarType.error}>{errorMessage}</MessageBar>
                </div>
            );
        }
        if (enrichedProjects.length === 0) {
            return (
                <div ref={ele => this.container = ele} >
                    <NoStoredProjectsMessage />
                </div>
            );
        }
        return this.renderSummarySections();
    }

    /**
     * Render summary sections
     */
    private renderSummarySections() {
        const { enrichedProjects, failedProjects } = this.state;

        return (
            <div ref={ele => this.container = ele} style={{ width: this.container.parentElement.clientWidth }}>
                <div>
                    {failedProjects.map(p => (
                        <div style={{ marginBottom: 10 }}>
                            <MessageBar messageBarType={MessageBarType.error}>{String.format(strings.ProgramProjectStatus_LoadingFailedMessage, p.Title)}</MessageBar>
                        </div>
                    ))}
                </div>
                <div className="ms-Grid">
                    {enrichedProjects.map(({ Title, URL, Data }, i) => {
                        return (
                            <SummarySection
                                key={`ProjectSummarySection_${i}`}
                                webUrl={URL}
                                title={Title}
                                titleUrl={`${URL}/SitePages/ProjectStatus.aspx`}
                                style={{ marginBottom: 20, paddingBottom: 20 }}
                                propertiesLabel={RESOURCE_MANAGER.getResource("ProjectStatus_Heading_ProjectMetadata")}
                                sections={Data.sections} />
                        );
                    })}
                </div>
            </div>
        );
    }

    /**
     * Get data for stored projects
     *
     * @param {ProjectItem[]} storedProjects Stored projects
     */
    private async getDataForStoredProjects(storedProjects: ProjectItem[]): Promise<{ enrichedProjects: EnrichedProjectItem[], failedProjects: ProjectItem[] }> {
        const statusSectionsConfigList = sp.site.rootWeb.lists.getByTitle(RESOURCE_MANAGER.getResource("Lists_StatusSections_Title"));
        const [statusSections, statusFieldsConfig] = await Promise.all([
            statusSectionsConfigList.items.orderBy("GtStSecOrder").usingCaching().get(),
            loadJsonConfiguration<any>("status-fields"),
        ]);

        let enrichedProjectsArray: EnrichedProjectItem[] = [];
        let failedProjects: ProjectItem[] = [];

        for (let i = 0; i < storedProjects.length; i++) {
            const project = storedProjects[i];
            const percentComplete = (i / storedProjects.length);
            const loadProgress: IProgressIndicatorProps = {
                percentComplete,
                description: String.format(strings.ProgramProjectStatus_LoadingTextDescription, project.Title),
                label: String.format(strings.ProgramProjectStatus_LoadingText, Math.floor(percentComplete * 100)),
            };
            this.setState({ loadProgress });
            try {
                let data: any = {};
                data.project = await new Web(project.URL).lists.getByTitle(config.Lists_ProjectProperties_Title).items.getById(1).fieldValuesAsHTML.usingCaching().get();
                data.sections = statusSections.map(section => new SectionModel(section, data.project, statusFieldsConfig)).filter(s => s.isValid());
                enrichedProjectsArray.push(new EnrichedProjectItem(project, data));
            } catch (err) {
                failedProjects.push(project);
            }
        }
        let enrichedProjects: EnrichedProjectItem[] = enrichedProjectsArray.sort((p1, p2) => { return p1.Title.localeCompare(p2.Title); });
        return { enrichedProjects, failedProjects };
    }
}

export {
    IProgramProjectStatusProps,
    IProgramProjectStatusState,
};
