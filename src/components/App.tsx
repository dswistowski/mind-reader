import React, {FunctionComponent, useState} from 'react';
import {useDebounce, useHistoryDb} from "../hooks";
import {SearchResult} from "./SearchResult";

import './App.css';
import {UrlEntry} from "../types";
import {Header} from "./Header";

const SearchResults: FunctionComponent<{results: UrlEntry[]}> = ({results}) => <div className="results">
    {results.map(result => <SearchResult key={result.url} {...result} />)}
</div>

const App: FunctionComponent = () => {
    const [search, setSearch] = useState("");
    const debouncedSearchTerm = useDebounce(search, 250);

    const results = useHistoryDb(debouncedSearchTerm, 20);

    return (
        <div className="App">
            <Header search={search} onUpdateSearch={setSearch}/>
            <SearchResults results={results} />
        </div>
    );
}

export default App;
