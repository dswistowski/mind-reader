import React, {FunctionComponent} from 'react';
import {useAppBusiness} from "../hooks";
import {AppStateless} from "./AppStateless";

const App: FunctionComponent = () => {
    const [search, setSearch, results, isSearching] = useAppBusiness();

    return (
        <AppStateless search={search} setSearch={setSearch} results={results} showButton={chrome && chrome.tabs && true}/>
    );
};

export default App;