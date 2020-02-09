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


export function useHistoryDb(query: string, limit: number): [UrlEntry[], boolean] {
    const [results, setResults] = useState<UrlEntry[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    useEffect(() => {

        if (query) {
            const test = testFunctionFactory(query);

            getDatabase().then(db => {
                console.log("Start query");
                setIsSearching(true)
                const objectStore = db.transaction(["history"], "readonly").objectStore("history");
                const valueIndex = objectStore.index('value');
                const results: UrlEntry[] = [];

                const cursorRequest = valueIndex.openCursor(null, 'prev');
                cursorRequest.onsuccess = (event: Event) => {
                    const cursor = cursorRequest.result;
                    if (cursor) {
                        if (test(query, cursor.value)) {
                            results.push(cursor.value);
                            if(results.length % 5 === 0) {
                                setResults(results)
                            }
                        }
                        if (results.length < limit) {
                            cursor.continue()
                        } else {
                            setIsSearching(false);
                            console.log("search finished");
                            setResults(results)
                        }
                    } else {
                        setIsSearching(false);
                        console.log("search finished");
                        setResults(results)
                    }
                };
                cursorRequest.onerror = (event) => {
                    setIsSearching(false);
                    console.error("Cannot execute query:", event)
                }
            })

        } else {
            setResults([])
        }
        return () => {
            console.log("not searching");
            setIsSearching(false)
        }
    }, [query, limit]);

    return [results, isSearching]
}

export function useAppBusiness(): [string, (value: string) => void, UrlEntry[], boolean] {
    const [search, setSearch] = useState("");
    const debouncedSearchTerm = useDebounce(search, 250);
    const [results, isSearching] = useHistoryDb(debouncedSearchTerm, 20);
    return [search, setSearch, results, isSearching]
}