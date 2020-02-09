import React from 'react';
import {action} from '@storybook/addon-actions';
import {AppStateless} from "../components/AppStateless";
import {generateSentence, generateUrlEntries} from "./helpers";

export default {
    title: 'App',
    component: AppStateless,
};


export const Empty = () => {
    return <AppStateless search={""} showButton={true} results={[]} setSearch={action("set-search")} />;
}


export const WithSomeResults = () => {
    return <AppStateless search={generateSentence(3)} showButton={true} results={generateUrlEntries(20)} setSearch={action("set-search")} />;

}