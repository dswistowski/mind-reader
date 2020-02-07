
const REFRESH_TIME = 60;  // todo set 60 as one hour in prod
const INFLATION = 0.99; //
const POINT_ON_URL = 10; //
const POINT_ON_SAME_DOMAIN = 1; //


function historyParser({title, url, visitCount}) {
    const parsedUrl = new URL(url);
    return {
        host: parsedUrl.host,
        title,
        url,
        value: visitCount
    }
}

function makePromiseFromRequest(request) {
    return new Promise(((resolve, reject) => {
        request.onsuccess = event => resolve(event.target.result);
        request.onerror = reject
    }))
}

async function getDatabase() {
    console.log("get database...")
    const dbRequest = indexedDB.open('history', 1);
    dbRequest.onupgradeneeded = async event => {
        console.log("on upgrade needed", event.newVersion);
        const db = dbRequest.result;
        if (event.newVersion <= 1) {
            const objectStore = db.createObjectStore("history", {keyPath: "url"})
            objectStore.createIndex("host", "host", {unique: false})
            objectStore.createIndex("title", "title", {unique: false})
            objectStore.createIndex("value", "value", {unique: false})

            objectStore.transaction.oncomplete = async () => {
                console.log("on transaction complete...");
                const parsedHistoryData = (await latestHistory()).map(historyParser);
                const objectStore = db.transaction(["history"], "readwrite").objectStore("history");
                parsedHistoryData.forEach(obj => objectStore.add(obj));
            };
        }
    };
    return makePromiseFromRequest(dbRequest);
}

async function latestHistory(howLongInHours) {
    console.log("get latest history", howLongInHours);
    const now = new Date().getTime()
    const howLongInMs = howLongInHours * 3600000
    return new Promise(resolve => {
        chrome.history.search({text: "", maxResults: 10000, startTime: now - howLongInMs, endTime: now}, resolve)
    })
}

chrome.runtime.onInstalled.addListener(async () => {
    console.log('onInstalled....');
    latestHistory().then(result => {
        window.dump = JSON.stringify(result.map(historyParser))
    });

    scheduleRefresh();
    refresh();
});

chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm && alarm.name === 'refresh') {
        refresh()
    } else {
        console.log("unknown alarm", alarm)
    }
});


async function updateScores(db, history) {
    console.log("update scores");
    const visitedDomains = new Set(history.map(({host}) => host));
    const visitedSites = new Set(history.map(({url}) => url));
    const updated = new Set([]);
    const objectStore = db.transaction(["history"], "readwrite").objectStore("history");

    objectStore.openCursor().onsuccess = event => {
        const cursor = event.target.result;
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
        const newHistories = history.filter(obj => !updated.has(obj.url));
        console.log(`there is ${newHistories.length} new history entries`);
        newHistories.forEach(obj => objectStore.add(obj));
    }
}

async function refresh() {
    console.log("refresh...");
    const db = await getDatabase();
    const history = (await latestHistory(REFRESH_TIME/60)).map(historyParser);
    // on each tick - all values are devaluated
    await updateScores(db, history);
}

function scheduleRefresh() {
    console.log('scheduleRefresh...');
    chrome.alarms.create('refresh', {periodInMinutes: REFRESH_TIME})
}