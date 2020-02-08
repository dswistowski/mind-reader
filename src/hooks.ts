import {useEffect, useState} from "react";
import {UrlEntry} from "./types";
import {testFunctionFactory} from "./helpers";
import {getDatabase} from "./database";

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
    const [results, setResults] = useState<UrlEntry[]>([]);
    useEffect(() => {
        if (query) {
            const test = testFunctionFactory(query);

            getDatabase().then(db => {
                console.log("have db", db);
                const objectStore = db.transaction(["history"], "readonly").objectStore("history");
                const valueIndex = objectStore.index('value');
                const results: UrlEntry[] = [];

                const cursorRequest = valueIndex.openCursor(null, 'prev');
                cursorRequest.onsuccess = (event: Event) => {
                    const cursor = cursorRequest.result;
                    console.log("query start", cursor)
                    if (cursor) {
                        if (test(query, cursor.value)) {
                            results.push(cursor.value)
                            console.log(".")
                        }
                        if (results.length < limit) {
                            cursor.continue()
                        } else {
                            console.log("results")
                            setResults(results)
                        }
                    } else {
                        setResults(results)
                    }
                }
            })

        } else {
            setResults([])
        }
    }, [query, limit]);

    return results
}