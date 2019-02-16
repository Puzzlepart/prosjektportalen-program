import { IColumn } from "office-ui-fabric-react/lib/DetailsList";

export default interface IProgramAddProjectProps {
    projectsSearchQuery?: string;
    columns?: IColumn[];
    rowLimit?: number;
}

export const ProgramAddProjectDefaultProps: Partial<IProgramAddProjectProps> = {
    projectsSearchQuery: `ContentTypeId:0x010088578E7470CC4AA68D5663464831070211* -Path:${_spPageContextInfo.webAbsoluteUrl}`,
    columns: [
        {
            key: "Title",
            fieldName: "Title",
            name: "Prosjektnavn",
            minWidth: 200,
            maxWidth: 300,
        },
        {
            key: "AddButton",
            fieldName: "AddButton",
            name: "",
            minWidth: 100,
            maxWidth: 200,
        },
    ],
    rowLimit: 25,
};
