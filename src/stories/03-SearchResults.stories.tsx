import React from 'react';
import {SearchResults} from "../components/SearchResults";
import {generateUrlEntries} from "./helpers";



export default {
    title: 'SearchResults',
    component: SearchResults,
    parameters: {
        info: {inline: true}
    }
};


export const Empty = () => <SearchResults results={generateUrlEntries(0)}/>;
export const Few = () => <SearchResults results={generateUrlEntries(4)}/>;
export const Lots = () => <SearchResults results={generateUrlEntries(30)}/>;