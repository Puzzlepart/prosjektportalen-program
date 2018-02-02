import { IColumn } from "office-ui-fabric-react/lib/DetailsList";

export default interface IProgramAddProjectProps {
    projectsSearchQuery?: string;
    columns?: IColumn[];
    rowLimit?: number;
}

export const ProgramAddProjectDefaultProps: Partial<IProgramAddProjectProps> = {
    projectsSearchQuery: `ContentTypeId:0x010109010058561f86d956412b9dd7957bbcd67aae0100* contentclass:STS_Web -Path:${_spPageContextInfo.webAbsoluteUrl}`,
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
