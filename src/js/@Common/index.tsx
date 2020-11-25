import { sp, List } from "@pnp/sp";
import * as strings from "../strings";
import * as config from "../config";
import ProjectItem from "./ProjectItem";
import IStatusMessage from "./IStatusMessage";
import { IDataSourceSearchCustom } from "prosjektportalen/lib/WebParts/DataSource";

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
        const list = sp.web.lists.getByTitle(config.Lists_StoredProjects_Title);
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
        items = items.filter(i => i.URL !== null && i.URL.Url !== "").map(({ ID, URL }) => new ProjectItem(ID, URL.Description, URL.Url));
        return { list, properties, items };
    } catch (err) {
        throw err;
    }
}

/**
* Build search settings from items in stored projects list
*/
export async function buildSearchSettingsFromStoredProjects(items: ProjectItem[], queryTemplate: string): Promise<Array<IDataSourceSearchCustom>>{
    try {
        if (items.length === 0) {
            return null;
        }
        let queryStr = '';
        let randArr = [];
        console.log(queryTemplate);
        await items.map(({ URL }, i) => {
            console.log(URL)
            if ((`${queryStr} OR ${URL} ${queryTemplate}`).length >= 3072) {
                randArr.push({RowLimit: 500, QueryTemplate: String.format(queryTemplate, queryStr)});
                queryStr = '';
            } 
            queryStr += `Path:"${URL}" OR `;
            if (items.length === i + 1) {
                randArr.push(String.format(queryTemplate, queryStr));
            }
            });
        return [{
            RowLimit: 500,
            QueryTemplate: randArr,
        }];
    } catch (err) {
        throw err;
    }
}

export function getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export { ProjectItem, IStatusMessage };
