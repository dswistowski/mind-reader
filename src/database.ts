import {historyParser, makePromiseFromRequest} from "./helpers";
import {HistoryItem, UrlEntry} from "./types";
import {INFLATION, POINT_ON_SAME_DOMAIN, POINT_ON_URL} from "./config";

export async function latestHistory(howLongInHours?: number): Promise<HistoryItem[]> {
    const now = new Date().getTime()
    const howLongInMs = howLongInHours ? howLongInHours * 3600000 : 0
    return new Promise(resolve => {
        if (chrome.history) {
            chrome.history.search({text: "", maxResults: 10000, startTime: now - howLongInMs, endTime: now}, resolve)
        } else {
            console.error("No `chrome.history`, skipping")
            resolve([])
        }
    })
}

export async function updateScores(db: IDBDatabase, history: UrlEntry[]) {
    console.log('start update scores');
    const visitedDomains = new Set(history.map(({host}: UrlEntry) => host));
    const visitedSites = new Set(history.map(({url}: UrlEntry) => url));
    const updated = new Set<string>([]);

    const objectStore = db.transaction(["history"], "readwrite").objectStore("history");
    const cursorRequest = objectStore.openCursor();

    return new Promise(resolve => {
        cursorRequest.onsuccess = (event: Event) => {
            const cursor = cursorRequest.result;
            if (cursor) {
                const obj = cursor.value;
                const domainPoints = visitedDomains.has(obj.host) ? POINT_ON_SAME_DOMAIN : 0;
                const sitePoints = visitedSites.has(obj.url) ? POINT_ON_URL : 0;
                const value = cursor.value.value * INFLATION + domainPoints + sitePoints;
                cursor.update({...obj, value: value});
                updated.add(obj.url);
                cursor.continue()
            }
        };

        objectStore.transaction.oncomplete = async () => {
            const objectStore = db.transaction(["history"], "readwrite").objectStore("history");
            const newHistories = history.filter((obj: UrlEntry) => !updated.has(obj.url));
            newHistories.forEach((obj: UrlEntry) => objectStore.add(obj));
            objectStore.transaction.oncomplete = async () => {
                console.log('updateScores finished');
                resolve()
            }
        }
    })
}

export async function wait(time: number) {
    return new Promise(resolve => setTimeout(resolve, time))
}


let db: IDBDatabase | null = null;
let gl_lock = 0;

export async function getDatabase(): Promise<IDBDatabase> {
    console.log("get database", )
    while (gl_lock > 0 && !db) {
        await wait(50);
    }
    if (db) {
        return db
    }

    gl_lock++;
    const dbRequest = indexedDB.open('history', 1);

    dbRequest.onupgradeneeded = async event => {
        console.log("old db found, upgrading");
        const db = dbRequest.result;
        if (event.newVersion !== null && event.newVersion <= 1) {
            const objectStore = db.createObjectStore("history", {keyPath: "url"});
            objectStore.createIndex("host", "host", {unique: false});
            objectStore.createIndex("title", "title", {unique: false});
            objectStore.createIndex("value", "value", {unique: false});

            objectStore.transaction.oncomplete = async () => {
                if (db) {
                    const parsedHistoryData = (await latestHistory()).map(historyParser);
                    const objectStore = db.transaction(["history"], "readwrite").objectStore("history");
                    parsedHistoryData.forEach((obj: UrlEntry) => objectStore.add(obj));
                }
            };
        }
    };
    db = await makePromiseFromRequest(dbRequest);
    db.onclose = () => {
        db = null
    };
    gl_lock--;
    console.log("database returned");
    return db
}