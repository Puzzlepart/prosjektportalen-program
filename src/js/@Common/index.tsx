import { sp, List } from "@pnp/sp";
import * as strings from "../strings";
import * as config from "../config";
import ProjectItem from "./ProjectItem";
import IStatusMessage from "./IStatusMessage";
import { IDataSourceSearchCustom } from "prosjektportalen/lib/WebParts/DataSource";
 import { format } from "office-ui-fabric-react/lib/Utilities";

export function getTimestamp(): string {
    return `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
}

export interface IListContext<T> {
    list: List;
    properties: any;
    items: T[];
}

export async function getStoredProjectsListContext(): Promise<IListContext<ProjectItem>> {
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
        items = items.filter(i => i.URL !== null && i.URL.Url !== "").map(({ ID, URL }) => new ProjectItem(ID, URL.Description, URL.Url));
        return { list, properties, items };
    } catch (err) {
        throw err;
    }
}

/**
* Build search queries from items in stored projects list
* 
* @param {ProjectItem[]} items Project items
* @param {string} queryTemplate Query template
* @param {number} maxQueryLength Max query length
*/
export async function buildSearchQueriesFromProgramProjects(items: ProjectItem[], queryTemplate: string, maxQueryLength: number = 3000): Promise<IDataSourceSearchCustom[]> {
    try {
        let index = 0
        const queries = items.reduce((arr, item) => {
            if (arr[index].QueryTemplate == null) {
                arr[index].QueryTemplate = `Path:${item.URL} `
            } else if (arr[index].QueryTemplate.length < maxQueryLength) {
                arr[index].QueryTemplate += `OR Path:${item.URL} `
            } else {
                arr.push({
                    QueryTemplate: format(`Path:${item.URL} `, queryTemplate),
                    RowLimit: 500,
                })
                index++
            }
            return arr
        }, [{ QueryTemplate: null, RowLimit: 500 }])
        return queries //.map(q => ({ ...q, QueryTemplate: format(queryTemplate, q.QueryTemplate) }))
    } catch (err) {
        throw err;
    }
}

export function getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export { ProjectItem, IStatusMessage };
