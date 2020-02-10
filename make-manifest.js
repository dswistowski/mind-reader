const manifest = {
    "manifest_version": 2,
    "name": "\uD83E\uDDE0 mind reader",
    "description": "New tab page with handy history search",
    "author": "damian@swistowski.org",
    "version": process.env.GITHUB_REF || "dev",
    "permissions": [
        "history",
        "storage",
        "alarms"
    ],
    "chrome_url_overrides": {
        "newtab": "index.html"
    },
    "background": {
        "scripts": [
            "background.js"
        ],
        "persistent": false
    }
};
console.log(JSON.stringify(manifest));