
export default class ProjectItem {
    public ListItemId: number;
    public Title: string;
    public URL: string;

    constructor(listItemId: number, title: string, url: string) {
        this.ListItemId = listItemId;
        this.Title = title;
        this.URL = url;
    }
}
