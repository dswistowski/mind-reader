import {useEffect, useState} from "react";
import {UrlEntry} from "./types";
import {testFunctionFactory} from "./helpers";

export function useDebounce(value: string, delay: number): string {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounced(value)
        }, delay);
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay]);
    return debounced
}


export function useHistoryDb(query: string, limit: number) {
    const [result, setResult] = useState<UrlEntry[]>([]);
    useEffect(() => {
        if (query) {
            const test = testFunctionFactory(query);
            const dbRequest = indexedDB.open('history', 1)
            dbRequest.onsuccess = event => {
                const db = dbRequest.result;
                const objectStore = db.transaction(["history"], "readonly").objectStore("history");
                const valueIndex = objectStore.index('value');
                const results: UrlEntry[] = [];

                const cursorRequest = valueIndex.openCursor(null, 'prev');
                cursorRequest.onsuccess = (event: Event) => {
                    const cursor = cursorRequest.result;
                    if (cursor) {
                        if (test(query, cursor.value)) {
                            results.push(cursor.value)
                        }
                        if (results.length < limit) {
                            cursor.continue()
                        } else {
                            console.log("found");
                            setResult(results)
                        }
                    } else {
                        console.log("end of search");
                        setResult(results)
                    }
                }
            }
        } else {
            setResult([])
        }
    }, [query, limit]);

    return result
}