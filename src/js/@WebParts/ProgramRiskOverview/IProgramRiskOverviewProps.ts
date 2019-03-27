export default interface IProgramRiskOverviewProps {
    queryTemplate?: string;
}

export const ProgramRiskOverviewDefaultProps: Partial<IProgramRiskOverviewProps> = {
    queryTemplate: "({0}) (ContentTypeId:0x010088578E7470CC4AA68D566346483107020101* GtShowInPortfolioOWSBOOL=1)",
};
