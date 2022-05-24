import { createApp } from 'vue';

import SyncToggleButton from '../components/SyncToggle.vue';

const syncToggleApp = createApp(SyncToggleButton);
const mountSyncToggleApp = (el: Element) => {
    if (el && el.parentNode) {
        // console.log(el);
        const crossSyncToggleEl = document.createElement('div');
        syncToggleApp.mount(crossSyncToggleEl);
        el.parentNode.insertBefore(crossSyncToggleEl, el);
    }
};

export const hooks: {
    selector: string;
    callback: (el: Element) => void;
}[] = [
    {
        selector: 'div[data-testid="primaryColumn"] div[data-testid="tweetButtonInline"]',
        callback: mountSyncToggleApp,
    },
    {
        selector: 'div[data-testid="tweetButton"]',
        callback: mountSyncToggleApp,
    },
];
export default hooks;
