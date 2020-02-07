import {useEffect, useState} from "react";

export function useDebounce(value, delay) {
    const [debounced, setDebounced] = useState(value)
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

export function useHistoryDb(query, limit, test) {
    const [result, setResult] = useState([])
    useEffect(() => {
        if (query) {
            indexedDB.open('history', 1).onsuccess = event => {
                const db = event.target.result;
                const objectStore = db.transaction(["history"], "readonly").objectStore("history");
                const valueIndex = objectStore.index('value')
                const results = [];

                valueIndex.openCursor(null, 'prev').onsuccess = event => {
                    const cursor = event.target.result;
                    if (cursor) {
                        if (test(query, cursor.value)) {
                            results.push(cursor.value)
                        }
                        if (results.length < limit) {
                            cursor.continue()
                        } else {
                            console.log("found")
                            setResult(results)
                        }
                    } else {
                        console.log("end of search")
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