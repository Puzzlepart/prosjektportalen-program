import { IColumn } from "office-ui-fabric-react/lib/DetailsList";

export default interface IProgramProjectsTimelineSyncProps {
    storedProjectsItemsPerPage?: number;
    storedProjectsColumns?: IColumn[];
    timelineDateValuesSyncMap?: { [key: string]: string };
    syncMessagesColumns?: IColumn[];
}

export const ProgramProjectsTimelineSyncDefaultProps: Partial<IProgramProjectsTimelineSyncProps> = {
    storedProjectsColumns: [
        {
            key: "Title",
            fieldName: "Title",
            name: "Prosjektnavn",
            minWidth: 200,
            maxWidth: 300,
        },
        {
            key: "SyncButton",
            fieldName: "SyncButton",
            name: "",
            minWidth: 100,
            maxWidth: 300,
        },
        {
            key: "RemoveButton",
            fieldName: "RemoveButton",
            name: "",
            minWidth: 100,
            maxWidth: 200,
        },
    ],
    syncMessagesColumns: [
        {
            key: "icon",
            fieldName: "icon",
            name: "",
            minWidth: 50,
            maxWidth: 50,
        },
        {
            key: "message",
            fieldName: "message",
            name: "Melding",
            minWidth: 200,
            maxWidth: 400,
        },
        {
            key: "timeStamp",
            fieldName: "timeStamp",
            name: "Tid",
            minWidth: 200,
            maxWidth: 300,
        },
    ],
    timelineDateValuesSyncMap: {
        StartDate: "GtStartDate",
        DueDate: "GtEndDate",
    },
};
