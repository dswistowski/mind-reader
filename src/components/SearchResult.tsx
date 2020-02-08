// @ts-ignore
import React, {FunctionComponent, useState} from "react";

import './SearchResult.css';
// @ts-ignore
import logo from './assets/brain.png'
import {UrlEntry} from "../types";
import "./SearchResult.css"

export const SearchResult: FunctionComponent<UrlEntry> = ({host, url, title, value}) => {
    const [thumbUrl, setThumbUrl] = useState(`https://${host}/favicon.ico`)

    return (
        <div className="SearchResult">
            <div className="ImgContainer">
                <img src={thumbUrl} onError={()=> setThumbUrl(logo)} />
            </div>
            <div className="ResultText">
                <a href={url} title={title}>{url}</a>
                <div>{title}</div>
            </div>
            <div className="value">{value.toFixed(2)}</div>
        </div>
    )
}