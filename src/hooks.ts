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

export function useAppBusiness(): [string, (value: string) => void, UrlEntry[]] {
    const [search, setSearch] = useState("");
    const debouncedSearchTerm = useDebounce(search, 250);
    const results = useHistoryDb(debouncedSearchTerm, 20);
    return [search, setSearch, results]
}