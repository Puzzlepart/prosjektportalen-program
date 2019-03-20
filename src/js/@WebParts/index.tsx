import WebPartComponent from "prosjektportalen/lib/WebParts/WebPartComponent";
import ProgramAddProject, { IProgramAddProjectProps } from "./ProgramAddProject";
import ProgramProjectsTimelineSync, { IProgramProjectsTimelineSyncProps } from "./ProgramProjectsTimelineSync";
import ProgramProjectStatus, { IProgramProjectStatusProps } from "./ProgramProjectStatus";
import ProgramProjectStats, { IProgramProjectStatsProps } from "./ProgramProjectStats";
import ProgramPortfolio, { IProgramPortfolioProps } from "./ProgramPortfolio";
import ProgramDeliveriesOverview, { IProgramDeliveriesOverviewProps } from "./ProgramDeliveriesOverview";
import ProgramBenefitsOverview, { IProgramBenefitsOverviewProps } from "./ProgramBenefitsOverview";
import ProgramRiskOverview, { IProgramRiskOverviewProps } from "./ProgramRiskOverview";

/**
 * An array containing WebPartComponents
 */
const WebPartComponents: WebPartComponent<any>[] = [
    new WebPartComponent<IProgramAddProjectProps>(ProgramAddProject, "pp-program-findproject", {}),
    new WebPartComponent<IProgramProjectsTimelineSyncProps>(ProgramProjectsTimelineSync, "pp-program-projectstimelinesync", {}),
    new WebPartComponent<IProgramProjectStatsProps>(ProgramProjectStats, "pp-program-projectstats", {}),
    new WebPartComponent<IProgramDeliveriesOverviewProps>(ProgramDeliveriesOverview, "pp-program-deliveriesoverview", {}),
    new WebPartComponent<IProgramRiskOverviewProps>(ProgramRiskOverview, "pp-program-riskoverview", {}),
    new WebPartComponent<IProgramProjectStatusProps>(ProgramProjectStatus, "pp-program-projectstatus", {}),
    new WebPartComponent<IProgramPortfolioProps>(ProgramPortfolio, "pp-program-portfolio", {}),
    new WebPartComponent<IProgramBenefitsOverviewProps>(ProgramBenefitsOverview, "pp-program-benefitsoverview", {}),
];
/**
 * Render the webparts
 */
export const Render = () => {
    WebPartComponents.forEach(wpc => wpc.renderOnPage());
};
