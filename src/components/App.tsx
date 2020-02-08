import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import {useDebounce, useHistoryDb} from "../hooks";
import {SearchResult} from "./SearchResult";

import './App.css';

const App: FunctionComponent = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if(inputRef.current){
            inputRef.current.focus()
        }
    }, [inputRef])
    const [search, setSearch] = useState("");
    const debouncedSearchTerm = useDebounce(search, 250);

    const {results, isSearching} = useHistoryDb(debouncedSearchTerm, 20);

    return (
        <div className="App">
            <div className="inputContainer">
                <input ref={inputRef} value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            {isSearching ? <div>Searching</div> :
                <div className="results">
                    {results.map(result => <SearchResult key={result.url} {...result} />)}
                </div>
            }
        </div>
    );
}

export default App;
