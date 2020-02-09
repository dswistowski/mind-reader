import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import chrome from 'sinon-chrome/extensions'
import {ShowTabs} from "./ShowTabs";


beforeAll(() => {
  global.chrome = chrome
});

afterAll(() => {
  chrome.flush()
});

test('click on show tab should change url of current tab to chrome-search://local-ntp/local-ntp.html', () => {
  chrome.tabs.getCurrent.callsFake((f) => f({id: 'new-tab'}));
  const {getByTestId} = render(<ShowTabs />);
  const button = getByTestId('show-tabs-button');
  fireEvent.click(button);
  expect(chrome.tabs.update.calledOnce).toBeTruthy();
  expect(chrome.tabs.update.withArgs('new-tab', {
    url: 'chrome-search://local-ntp/local-ntp.html',
  }).calledOnce).toBeTruthy();
});