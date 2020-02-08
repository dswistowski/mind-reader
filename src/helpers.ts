import {FilterFunction} from "./types";

function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function testFunctionFactory(search: string): FilterFunction {
    const queryRegExp = new RegExp(escapeRegExp(search).replace(' ', '.*'), 'i');
    return (query, {url}) => queryRegExp.test(url);
}