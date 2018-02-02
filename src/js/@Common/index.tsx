import pnp, { List } from "sp-pnp-js";
import * as strings from "../strings";
import * as config from "../config";
import ProjectItem from "./ProjectItem";
import IStatusMessage from "./IStatusMessage";

export function getTimestamp(): string {
    return `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
}

export interface IListContext<T> {
    list: List;
    properties: any;
    items: T[];
}

export async function getStoredProjectsListContext(maxLimit = config.Lists_StoredProjects_ItemsMaxLimit): Promise<IListContext<ProjectItem>> {
    try {
        const list = pnp.sp.web.lists.getByTitle(config.Lists_StoredProjects_Title);
        let properties;
        let items;
        try {
            [properties, items] = await Promise.all([
                list.select("ListItemEntityTypeFullName").get(),
                list.items.select("ID", "URL").get(),
            ]);
        } catch {
            throw strings.Lists_StoredProjects_DoesNotExist;
        }
        if (items.length > maxLimit) {
            throw String.format(strings.Lists_StoredProjects_MaxLimitError, items.length, config.Lists_StoredProjects_ItemsMaxLimit);
        }
        items = items.map(({ ID, URL }) => new ProjectItem(ID, URL.Description, URL.Url));
        return { list, properties, items };
    } catch (err) {
        throw err;
    }
}

export function getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export { ProjectItem, IStatusMessage };
