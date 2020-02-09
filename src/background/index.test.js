import chrome from 'sinon-chrome/extensions'
import {onAlarm, onInstalled} from "./background";

beforeAll(() => {
    global.chrome = chrome
    const background = require("./index");
});

afterAll(() => {
    chrome.flush()
});

test('backround should set correct onAlarm handler', () => {
    expect(chrome.alarms.onAlarm.addListener.withArgs(onAlarm).calledOnce).toBeTruthy()
});


test('backround should set correct onInstalled handler', () => {
    expect(chrome.runtime.onInstalled.addListener.withArgs(onInstalled).calledOnce).toBeTruthy()
});
