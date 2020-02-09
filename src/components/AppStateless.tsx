import React, {FunctionComponent} from "react";
import {Header} from "./Header";
import {SearchResults} from "./SearchResults";
import {UrlEntry} from "../types";
import './AppStateless.css';

type AppStatelessProps = {
    search: string,
    setSearch: (value: string) => void,
    results: UrlEntry[],
    showButton: boolean
}
export const AppStateless: FunctionComponent<AppStatelessProps> = ({search, setSearch, results, showButton}) =>
    <div
        className="AppStateless">
        <Header search={search} onUpdateSearch={setSearch} showButton={showButton}/>
        <SearchResults results={results}/>
    </div>;