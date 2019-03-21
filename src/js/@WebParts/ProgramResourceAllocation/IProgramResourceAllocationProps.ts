import { SearchQuery } from "@pnp/sp";

export default interface IProgramResourceAllocationProps {
    queryTemplate?: string;
    searchConfiguration?: SearchQuery;
}

export const ProgramResourceAllocationDefaultProps: Partial<IProgramResourceAllocationProps> = {
    queryTemplate: "({0}) (ContentTypeId:0x010088578E7470CC4AA68D5663464831070209*)",
    searchConfiguration: {
        Querytext: "*",
        RowLimit: 500,
        TrimDuplicates: false,
        SelectProperties: [
          "Title",
          "Path",
          "SPWebUrl",
          "WebId",
          "GtResourceLoadOWSNMBR",
          "GtResourceAbsenceCommentOWSTEXT",
          "SiteTitle",
          "GtStartDateOWSDATE",
          "GtEndDateOWSDATE",
          "RefinableString71",
          "RefinableString72",
          "RefinableString52",
        ],
      },
};
