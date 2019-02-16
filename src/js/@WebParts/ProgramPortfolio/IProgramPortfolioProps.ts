export default interface IProgramPortfolioProps {
    queryTemplate?: string;
    fields?: string[];
    refiners?: string[];
}

export const ProgramPortfolioDefaultProps: Partial<IProgramPortfolioProps> = {
    queryTemplate: "ContentTypeId:0x010088578E7470CC4AA68D5663464831070211* {0}",
    fields: ["Tittel", "Fase", "Målsetning", "Prosjektleder", "Prosjekteier", "Status fremdrift", "Status økonomi", "Status kvalitet", "Status risiko"],
    refiners: ["Tjenesteområde", "Prosjekteier", "Prosjektleder", "Fase"],

};
