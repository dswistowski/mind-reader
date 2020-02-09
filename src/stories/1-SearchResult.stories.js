import React from 'react';
import {SearchResult} from "../components/SearchResult";

export default {
  title: 'SearchResult',
  component: SearchResult,
};

export const Default = () => <SearchResult
    host="github.com"
    url="https://github.com/dswistowski"
    value={5}
    title="dswistowski"
/>;

