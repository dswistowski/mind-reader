import {FilterFunction, HistoryItem, UrlEntry} from "./types";


function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function testFunctionFactory(search: string): FilterFunction {
    const queryRegExp = new RegExp(escapeRegExp(search).replace(' ', '.*'), 'i');
    return (query, {url}) => queryRegExp.test(url);
}


export function historyParser({title, url, visitCount}: HistoryItem): UrlEntry {
    url = url || "";
    const parsedUrl = new URL(url);
    return {
        host: parsedUrl.host,
        title,
        url,
        value: visitCount || 0
    }
}

export function makePromiseFromRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise(((resolve, reject) => {
        // @ts-ignore
        request.onsuccess = event => resolve(event.target.result);
        request.onerror = event => {
            console.error("Got error: ", event);
            reject()
        }
    }))
}