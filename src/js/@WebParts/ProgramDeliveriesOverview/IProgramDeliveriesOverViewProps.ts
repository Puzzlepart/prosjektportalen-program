export default interface IProgramDeliveriesOverviewProps {
    queryTemplate?: string;
}

export const ProgramDeliveriesOverviewDefaultProps: Partial<IProgramDeliveriesOverviewProps> = {
    queryTemplate: "({0}) (ContentTypeId:0x010088578E7470CC4AA68D5663464831070205*)",
};
