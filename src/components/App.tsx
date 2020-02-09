import React, {FunctionComponent, useState} from 'react';
import {useDebounce, useHistoryDb} from "../hooks";

import './App.css';
import {Header} from "./Header";
import {SearchResults} from "./SearchResults";

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
