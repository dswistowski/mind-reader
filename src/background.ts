import {UrlEntry} from "./types";
import Alarm = chrome.alarms.Alarm;
import HistoryItem = chrome.history.HistoryItem;


const INFLATION = 0.99; //
const POINT_ON_URL = 10; //
const POINT_ON_SAME_DOMAIN = 1; //


const REFRESH_TIME = 60;  // todo set 60 as one hour in prod

export async function latestHistory(howLongInHours?: number): Promise<HistoryItem[]> {
    console.log("get latest history", howLongInHours);
    const now = new Date().getTime()
    const howLongInMs = howLongInHours? howLongInHours* 3600000: 0
    return new Promise(resolve => {
        chrome.history.search({text: "", maxResults: 10000, startTime: now - howLongInMs, endTime: now}, resolve)
    })
}


export function scheduleRefresh() {
    console.log('scheduleRefresh...');
    chrome.alarms.create('refresh', {periodInMinutes: REFRESH_TIME})
}
function onAlarm(alarm: Alarm) {
    if (alarm && alarm.name === 'refresh') {
        refresh()
    } else {
        console.log("unknown alarm", alarm)
    }
}

async function onInstalled() {
    console.log('onInstalled....');
    scheduleRefresh();
    refresh();
}

chrome.runtime.onInstalled.addListener(onInstalled);

chrome.alarms.onAlarm.addListener(onAlarm);


function historyParser({title, url, visitCount}: HistoryItem): UrlEntry {
    url = url || ""
    const parsedUrl = new URL(url);
    return {
        host: parsedUrl.host,
        title,
        url,
        value: visitCount || 0
    }
}

function makePromiseFromRequest<T>(request: IDBRequest): Promise<T> {
    return new Promise(((resolve, reject) => {
        // @ts-ignore
        request.onsuccess = event => resolve(event.target.result);
        request.onerror = reject
    }))
}

async function getDatabase(): Promise<IDBDatabase> {
    console.log("get database...")
    const dbRequest = indexedDB.open('history', 1);
    dbRequest.onupgradeneeded = async event => {
        console.log("on upgrade needed", event.newVersion);
        const db = dbRequest.result;
        if ( event.newVersion!==null && event.newVersion <= 1) {
            const objectStore = db.createObjectStore("history", {keyPath: "url"})
            objectStore.createIndex("host", "host", {unique: false})
            objectStore.createIndex("title", "title", {unique: false})
            objectStore.createIndex("value", "value", {unique: false})

            objectStore.transaction.oncomplete = async () => {
                console.log("on transaction complete...");
                const parsedHistoryData = (await latestHistory()).map(historyParser);
                const objectStore = db.transaction(["history"], "readwrite").objectStore("history");
                parsedHistoryData.forEach((obj: UrlEntry) => objectStore.add(obj));
            };
        }
    };
    return makePromiseFromRequest(dbRequest);
}




async function updateScores(db: IDBDatabase, history: UrlEntry[]) {
    console.log("update scores");
    const visitedDomains = new Set(history.map(({host}: UrlEntry) => host));
    const visitedSites = new Set(history.map(({url}: UrlEntry) => url));
    const updated = new Set<string>([]);
    const objectStore = db.transaction(["history"], "readwrite").objectStore("history");

    const cursorRequest = objectStore.openCursor();
    cursorRequest.onsuccess = (event: Event) => {
        const cursor = cursorRequest.result;
        if (cursor) {
            const obj = cursor.value;
            const domainPoints = visitedDomains.has(obj.host) ? POINT_ON_SAME_DOMAIN : 0;
            const sitePoints = visitedSites.has(obj.url) ? POINT_ON_URL : 0
            const value = cursor.value.value * INFLATION + domainPoints + sitePoints;
            cursor.update({...obj, value: value});
            updated.add(obj.url);
            cursor.continue()
        }
    }

    objectStore.transaction.oncomplete = async () => {
        const objectStore = db.transaction(["history"], "readwrite").objectStore("history");
        const newHistories = history.filter( (obj: UrlEntry) => !updated.has(obj.url));
        console.log(`there is ${newHistories.length} new history entries`);
        newHistories.forEach((obj: UrlEntry) => objectStore.add(obj));
    }
}

async function refresh() {
    console.log("refresh...");
    const db = await getDatabase();
    const history = (await latestHistory(1)).map(historyParser);
    // on each tick - all values are devaluated
    await updateScores(db, history);
}

