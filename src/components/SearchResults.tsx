import React, {FunctionComponent} from "react";
import {UrlEntry} from "../types";
import {SearchResult} from "./SearchResult";

export const SearchResults: FunctionComponent<{ results: UrlEntry[] }> = ({results}) =>
    <div className="results">
        {results.map(result => <SearchResult key={result.url} {...result} />)}
    </div>