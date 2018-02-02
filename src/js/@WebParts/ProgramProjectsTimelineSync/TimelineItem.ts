export default interface TimelineItem {
    ID?: number;
    Title: string;
    URL: { Url: string, Description: string };
    StartDate?: string;
    DueDate?: string;
}
