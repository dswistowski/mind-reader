// @ts-ignore
import React, {FunctionComponent, useState} from "react";
// @ts-ignore
import logo from './assets/brain.png'
import "./SearchResult.css"
import {UrlEntry} from "../types";


export const SearchResult: FunctionComponent<UrlEntry> = ({host, url, title, value}) => {
    const [thumbUrl, setThumbUrl] = useState(`https://${host}/favicon.ico`)

    return (
        <div data-testid="search-result" className="SearchResult">
            <div className="ImgContainer">
                <img src={thumbUrl} onError={()=> setThumbUrl(logo)} />
            </div>
            <div className="ResultText">
                <a href={url} title={title}>{url}</a>
                <p className="title">{title}</p>
            </div>
            <div className="value">{value.toFixed(2)}</div>
        </div>
    )
}