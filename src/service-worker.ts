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

const beforeRequestListener = (details: chrome.webRequest.WebRequestBodyDetails) => {
    let data;
    let for_uri: string | null = null;
    if (details.requestBody?.raw?.[0]?.bytes) {
        const enc = new TextDecoder('utf-8');
        const arr = new Uint8Array(details.requestBody.raw[0].bytes);
        data = JSON.parse(enc.decode(arr));
        isDark[details.requestId] = data.variables.dark_request;

        // Check type
        if (data.variables.reply?.in_reply_to_tweet_id) {
            // Is reply
            for_uri = `https://twitter.com/i/status/${data.variables.reply.in_reply_to_tweet_id}`;
        } else if (data.variables.attachment_url) {
            // Is quote
            for_uri = data.variables.attachment_url;
        }
    }
    if (!hasDarkQueries[data.queryId]) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            tabId = tabs?.[0]?.id;
            if (tabId) {
                chrome.tabs.sendMessage(tabId, {
                    type: 'create-tweet-start',
                    for_uri,
                });
            }
        });
    }
    if (data.variables.dark_request) {
        hasDarkQueries[data.queryId] = true;
    } else if (hasDarkQueries[data.queryId]) {
        delete hasDarkQueries[data.queryId];
    }
};

const afterResponseListener = (details: chrome.webRequest.WebResponseCacheDetails) => {
    if (tabId) {
        if (isDark[details.requestId]) {
            delete isDark[details.requestId];
        } else {
            chrome.tabs.sendMessage(tabId, {
                type: 'create-tweet-end',
            });
        }
    }
};

const wakeUpSW = () => {
    // Wake Up
    if (!chrome.webRequest.onBeforeRequest.hasListener(beforeRequestListener)) {
        chrome.webRequest.onBeforeRequest.addListener(
            beforeRequestListener,
            {
                urls: ['https://twitter.com/*/CreateTweet'],
            },
            ['requestBody'],
        );
    }
    if (!chrome.webRequest.onCompleted.hasListener(afterResponseListener)) {
        chrome.webRequest.onCompleted.addListener(afterResponseListener, {
            urls: ['https://twitter.com/*/CreateTweet'],
        });
    }
};

chrome.webNavigation.onBeforeNavigate.addListener(wakeUpSW, {
    url: [{ hostContains: 'twitter.com' }],
});

// Wake Up SW by Content Script
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'wakeup-sw') {
        wakeUpSW();
    }
});
