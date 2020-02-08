import {historyParser} from "./helpers";
import {getDatabase, latestHistory, updateScores} from "./database";
import {REFRESH_TIME} from "./config";
import Alarm = chrome.alarms.Alarm;


export function scheduleRefresh() {
    console.log('scheduleRefresh...');
    chrome.alarms.create('refresh', {periodInMinutes: REFRESH_TIME})
}


async function refresh() {
    console.log("refresh...");
    const db = await getDatabase();
    const history = (await latestHistory(REFRESH_TIME/60)).map(historyParser);
    await updateScores(db, history);
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
