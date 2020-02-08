import React, {FunctionComponent} from "react";
import {ShowTabs} from "./ShowTabs";
import "./Header.css"

type HeaderProps = {
    search: string,
    onUpdateSearch: (value: string) => void
}

export const Header: FunctionComponent<HeaderProps> = ({search, onUpdateSearch}) =>
    <div className="Header">
        <input placeholder="What is in your mind" value={search}
               onChange={e => onUpdateSearch(e.target.value)}/>
        {chrome.tabs ? <ShowTabs/> : ""}
    </div>