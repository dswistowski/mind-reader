import {historyParser} from "../helpers";
import {getDatabase, latestHistory, updateScores} from "../database";
import {REFRESH_TIME} from "../config";


function scheduleRefresh() {
    chrome.alarms.create('refresh', {periodInMinutes: REFRESH_TIME})
}

async function refresh() {
    const db = await getDatabase();
    const history = (await latestHistory(REFRESH_TIME/60)).map(historyParser);
    await updateScores(db, history);
}


export async function onAlarm(alarm: chrome.alarms.Alarm) {
    if (alarm && alarm.name === 'refresh') {
        await refresh()
    } else {
        console.error("unknown alarm", alarm)
    }
}

export async function onInstalled() {
    scheduleRefresh();
    await refresh();
}