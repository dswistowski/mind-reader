import React, {useState} from "react";

import './SearchResult.css';
import logo from './logo192.png'

export function SearchResult({host, url, title, value}) {
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
            <div className="value">{Number.parseFloat(value).toFixed(2)}</div>
        </div>
    )
}