export default interface IProgramExperienceLogProps {
    queryTemplate?: string;
}

export const ProgramExperienceLogDefaultProps: Partial<IProgramExperienceLogProps> = {
    queryTemplate: "({0}) (ContentTypeId:0x010088578e7470cc4aa68d5663464831070206* GtProjectLogExperienceOWSBOOL=1)",
};
