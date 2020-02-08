import React, {useState} from 'react';
import {useDebounce, useHistoryDb} from "./hooks";
import {SearchResult} from "./SearchResult";

import './App.css';

function App() {
    const [search, setSearch] = useState("");
    const debouncedSearchTerm = useDebounce(search, 500);

    const results = useHistoryDb(debouncedSearchTerm, 20);

    return (
        <div className="App">
            <div className="inputContainer">
                <input value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <div className="results">
                {results.map(result => <SearchResult key={result.url} {...result} />)}
            </div>
        </div>
    );
}

export default App;
