import {onAlarm, onInstalled} from "./background";

chrome.runtime.onInstalled.addListener(onInstalled);
chrome.alarms.onAlarm.addListener(onAlarm);
