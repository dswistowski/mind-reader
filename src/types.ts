export type UrlEntry = {
    url: string,
    host: string,
    title?: string,
    value: number
}

export interface HistoryItem {
    /** Optional. The number of times the user has navigated to this page by typing in the address. */
    typedCount?: number;
    /** Optional. The title of the page when it was last loaded. */
    title?: string;
    /** Optional. The URL navigated to by a user. */
    url?: string;
    /** Optional. When this page was last loaded, represented in milliseconds since the epoch. */
    lastVisitTime?: number;
    /** Optional. The number of times the user has navigated to this page. */
    visitCount?: number;
    /** The unique identifier for the item. */
    id: string;
}

export type FilterFunction = (query: string, entry: UrlEntry) => boolean;