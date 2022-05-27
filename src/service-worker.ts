console.log('Service Worker is running');

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'open-options') {
        chrome.runtime.openOptionsPage();
    }
});
