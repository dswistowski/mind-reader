import chrome from 'sinon-chrome/extensions'
import {onInstalled, onAlarm} from "./background";
import {REFRESH_TIME} from "../config";
import {getDatabase, updateScores} from "../database";
import {historyParser, makePromiseFromRequest} from "../helpers";

async function flushDatabases() {
    const databaseNames = [...indexedDB._databases.keys()];
    await Promise.all(
        databaseNames.map(async name => {
            const db = await makePromiseFromRequest(indexedDB.open(name));
            await Promise.all([...db.objectStoreNames].map(
                store => db.transaction([store], "readwrite").objectStore(store).clear()
            ))
        })
    );
}

async function query(store) {
    const db = await getDatabase();
    const objectStore = db.transaction([store], "readonly").objectStore(store);
    return new Promise(resolve => {
        objectStore.getAll().onsuccess = (event) => {
            resolve(event.target.result);
        }
    })
}


beforeAll(() => {
    global.chrome = chrome;
});

afterAll( () => {
    chrome.flush();
});

afterEach(flushDatabases);

test('onInstalled should set alarm ', () => {
    onInstalled();
    expect(chrome.alarms.create).toHaveBeenCalledOnceWith('refresh', {periodInMinutes: REFRESH_TIME})
});

const history = [
    {"id":"58563","lastVisitTime":1581275326051.38,"title":"🧠 New tab","typedCount":10,"url":"http://localhost:3000/","visitCount":175},
    {"id":"63082","lastVisitTime":1581275270033.091,"title":"dswistowski/mind-reader: Browser extension to show you most usable links from your history 🧠","typedCount":3,"url":"https://github.com/dswistowski/mind-reader","visitCount":43},
    {"id":"63280","lastVisitTime":1581275267371.311,"title":"Chrome Addon Action · Actions · GitHub Marketplace","typedCount":0,"url":"https://github.com/marketplace/actions/chrome-addon-action","visitCount":1},
    {"id":"63287","lastVisitTime":1581275261503.0662,"title":"Usage with Jest - ReferenceError: chrome is not defined · Issue #82 · acvetkov/sinon-chrome","typedCount":0,"url":"https://github.com/acvetkov/sinon-chrome/issues/82","visitCount":1},
];



test('onInstalled should load old historic data', async() => {
    expect((await query("history")).length).toEqual(0)
    chrome.history.search.callsFake((s, f) => f(history));
    await onInstalled();
    expect(chrome.history.search).toHaveBeenCalled();
    const results = await query("history")

    expect(results.length).toEqual(history.length)
    expect(results[0]).toEqual({
        host: expect.any(String),
        title: expect.any(String),
        url: expect.any(String),
        value: expect.any(Number)
    })
});

test('onAlarm should change scores', async () => {
    await updateScores(await getDatabase(), history.map(historyParser));
    chrome.history.search.callsFake((s, f) => f([]));

    const oldResults = await query("history");
    await onAlarm({name: "refresh"});
    const results = await query("history");

    oldResults.forEach((oldResult, i) => {
        const newResult = results[i];
        expect(newResult.value).toBeLessThan(oldResult.value);
    })
});


