console.log('Service Worker is running');

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'open-options') {
        chrome.runtime.openOptionsPage();
    }
});

// dark mode is twitter blue undo tweet
let hasDarkQueries: {
    [key: string]: boolean;
} = {};
let isDark: {
    [key: string]: boolean;
} = {};

let tabId: number | undefined;
chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        let data;
        if (details.requestBody?.raw?.[0]?.bytes) {
            const enc = new TextDecoder('utf-8');
            const arr = new Uint8Array(details.requestBody.raw[0].bytes);
            data = JSON.parse(enc.decode(arr));
            isDark[details.requestId] = data.variables.dark_request;
        }
        if (!hasDarkQueries[data.queryId]) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                tabId = tabs?.[0]?.id;
                if (tabId) {
                    chrome.tabs.sendMessage(tabId, {
                        type: 'create-tweet-start',
                    });
                }
            });
        }
        if (data.variables.dark_request) {
            hasDarkQueries[data.queryId] = true;
        } else if (hasDarkQueries[data.queryId]) {
            delete hasDarkQueries[data.queryId];
        }
    },
    {
        urls: ['https://twitter.com/*/CreateTweet'],
    },
    ['requestBody'],
);

chrome.webRequest.onCompleted.addListener(
    (details) => {
        if (tabId) {
            if (isDark[details.requestId]) {
                delete isDark[details.requestId];
            } else {
                chrome.tabs.sendMessage(tabId, {
                    type: 'create-tweet-end',
                });
            }
        }
    },
    {
        urls: ['https://twitter.com/*/CreateTweet'],
    },
);
