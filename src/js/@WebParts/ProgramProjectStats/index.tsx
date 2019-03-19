import * as React from "react";
import { IProgramProjectStatsProps } from "./IProgramProjectStatsProps";
import { IProgramProjectStatsState } from "./IProgramProjectStatsState";
import ProjectStats from "prosjektportalen/lib/WebParts/ProjectStats";


export default class ProgramProjectStats extends React.Component<IProgramProjectStatsProps, IProgramProjectStatsState> {
    public render(): React.ReactElement<IProgramProjectStatsProps> {
        return (
            <div>
                <h1>Porteføljeinnsikt</h1>
                <ProjectStats statsFieldsListName="Statistikkfelter" viewSelectorEnabled={true} chartsConfigListName="" />
            </div>
        );
    }
}

export { IProgramProjectStatsProps, IProgramProjectStatsState };
