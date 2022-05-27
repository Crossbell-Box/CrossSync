console.log('Service Worker is running');

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'open-options') {
        chrome.runtime.openOptionsPage();
    }
});

let tabId: number | undefined;
chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            tabId = tabs?.[0]?.id;
            if (tabId) {
                chrome.tabs.sendMessage(tabId, {
                    type: 'create-tweet-start',
                });
            }
        });
    },
    {
        urls: ['https://twitter.com/*/CreateTweet'],
    },
);

chrome.webRequest.onCompleted.addListener(
    (details) => {
        if (tabId) {
            chrome.tabs.sendMessage(tabId, {
                type: 'create-tweet-end',
            });
        }
    },
    {
        urls: ['https://twitter.com/*/CreateTweet'],
    },
);
