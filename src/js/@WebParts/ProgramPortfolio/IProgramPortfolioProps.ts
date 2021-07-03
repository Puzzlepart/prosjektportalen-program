export default interface IProgramPortfolioProps {
    queryTemplate?: string;
}

export const ProgramExperienceLogDefaultProps: Partial<IProgramPortfolioProps> = {
    queryTemplate: '({0}) ContentTypeId:0x010088578E7470CC4AA68D5663464831070211* NOT GtProjectLifecycleStatusOWSCHCS="Avsluttet"'
};
