import React from 'react';
import {SearchResults} from "../components/SearchResults";

const faker = require("faker");

export default {
    title: 'SearchResults',
    component: SearchResults,
    parameters: {
        info: {inline: true}
    }
};


function generateUrlEntries(howMany: number) {
    return Array.from({length: howMany}, () => {
        return {
            host: "github.com",
            url: faker.internet.url(),
            title: faker.lorem.sentence(10),
            value: faker.random.number(10)
        }
    })
}

export const Empty = () => <SearchResults results={generateUrlEntries(0)}/>;
export const Few = () => <SearchResults results={generateUrlEntries(4)}/>;
export const Lots = () => <SearchResults results={generateUrlEntries(500)}/>;