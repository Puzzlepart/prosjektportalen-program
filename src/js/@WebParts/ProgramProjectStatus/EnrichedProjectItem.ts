import { ProjectItem } from "../../@Common";

export default class EnrichedProjectItem extends ProjectItem {
    public Data: any;

    constructor({ ListItemId, Title, URL }: ProjectItem, data) {
        super(ListItemId, Title, URL);
        this.Data = data;
    }
}
