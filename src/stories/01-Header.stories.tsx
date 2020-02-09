import React from 'react';
import {Header} from "../components/Header";
import { action } from '@storybook/addon-actions';
import {generateSentence} from "./helpers";

export default {
    title: 'Header',
    component: Header,
};


export const Empty = () => {
    return <Header
        search=""
        onUpdateSearch={action('search-update')}
    />;
}

export const EmptyWithButton = () => {
    return <Header
        search=""
        onUpdateSearch={action('search-update')}
        showButton={true}
    />;
}


export const WithSearchPhrase = () => <Header
    search={generateSentence(3)}
    onUpdateSearch={action('search-update')}
/>;

export const WithSearchPhraseWithButton = () => <Header
    search={generateSentence(3)}
    onUpdateSearch={action('search-update')}
    showButton={true}
/>;
