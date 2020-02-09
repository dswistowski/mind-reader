import React, {FunctionComponent, useState} from 'react';
import {useDebounce, useHistoryDb} from "../hooks";
import {AppStateless} from "./AppStateless";

const App: FunctionComponent = () => {
    const [search, setSearch] = useState("");
    const debouncedSearchTerm = useDebounce(search, 250);
    const results = useHistoryDb(debouncedSearchTerm, 20);

    return (
        <AppStateless search={search} setSearch={setSearch} results={results} showButton={chrome && chrome.tabs && true}/>
    );
}

export default App;

