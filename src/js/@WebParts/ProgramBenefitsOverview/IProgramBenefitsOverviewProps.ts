export default interface IProgramBenefitsOverviewProps {
    queryTemplate?: string;
    excelExportEnabled?: boolean;
}

export const ProgramBenefitsOverviewDefaultProps: Partial<IProgramBenefitsOverviewProps> = {
    queryTemplate: "({0}) (ContentTypeID:0x0100B384774BA4EBB842A5E402EBF4707367* OR ContentTypeID:0x01007A831AC68204F04AAA022CFF06C7BAA2*)",
    excelExportEnabled: true,
};
