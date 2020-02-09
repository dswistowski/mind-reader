import React, {FunctionComponent} from "react";
import {ShowTabs} from "./ShowTabs";
import "./Header.css"

type HeaderProps = {
    search: string,
    onUpdateSearch: (value: string) => void
    showButton?: boolean
}

export const Header: FunctionComponent<HeaderProps> = ({search, onUpdateSearch, showButton}) =>
    <div className="Header">
        <input data-testid="search-input" placeholder="What is in your mind" value={search} onChange={e => onUpdateSearch(e.target.value)}/>
        {showButton ? <ShowTabs/> : ""}
    </div>