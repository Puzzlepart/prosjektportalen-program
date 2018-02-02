export default interface IProgramPortfolioProps {
    queryTemplate?: string;
    fields?: string[];
    refiners?: string[];
}

export const ProgramPortfolioDefaultProps: Partial<IProgramPortfolioProps> = {
    queryTemplate: "ContentTypeId:0x010109010058561f86d956412b9dd7957bbcd67aae0100* {0}",
    fields: ["Tittel", "Fase", "Målsetning", "Prosjektleder/programleder", "Prosjekteier/programeier", "Status fremdrift", "Status økonomi", "Status kvalitet", "Status risiko"],
    refiners: ["Tjenesteområde", "Prosjekteier/programeier", "Prosjektleder/programleder", "Fase"],

};
