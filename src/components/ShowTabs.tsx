import React, {FunctionComponent} from "react";
import './ShowTabs.css'

export const ShowTabs: FunctionComponent = () => <button className="ShowTabs"
    onClick={() => {
        chrome.tabs.getCurrent(tab => {
            if (tab && tab.id) {
                chrome.tabs.update(tab.id, {
                    url: 'chrome-search://local-ntp/local-ntp.html',
                });
            }
        });
    }}>
    Chrome Tab
</button>