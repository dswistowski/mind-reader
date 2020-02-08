export type UrlEntry = {
    url: string,
    host: string,
    title?: string,
    value: number
}

export type FilterFunction = (query: string, entry: UrlEntry) => boolean;