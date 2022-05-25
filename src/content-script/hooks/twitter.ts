import { createApp, App } from 'vue';
import ElementPlus from 'element-plus';

import SyncToggleButton from '@/components/SyncToggle.vue';

let syncToggleApp: App<Element> | null = null;
let crossSyncToggleEl: HTMLDivElement;

const mountSyncToggleApp = (el: Element) => {
    if (el && el.parentNode) {
        if (!syncToggleApp) {
            syncToggleApp = createApp(SyncToggleButton);
            syncToggleApp.use(ElementPlus);

            crossSyncToggleEl = document.createElement('div');
            syncToggleApp.mount(crossSyncToggleEl);
        }

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
