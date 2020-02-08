// @ts-ignore
import React, {useState} from "react";

import './SearchResult.css';
// @ts-ignore
import logo from './logo192.png'
import {UrlEntry} from "./types";

export function SearchResult({host, url, title, value}: UrlEntry) {
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
            <div className="value">{new Number(value).toFixed(2)}</div>
        </div>
    )
}