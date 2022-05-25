import { createApp, App } from 'vue';
import ElementPlus from 'element-plus';

import { upload } from '@/common/ipfs';

import SyncToggleButton from '@/components/SyncToggle.vue';
// import {useStore} from "@/common/store";

let syncToggleApp: App<Element> | null = null;
let crossSyncToggleEl: HTMLDivElement;

// const store = useStore();

const CROSSSYNC_CONSOLE_LOG_FORMAT = {
    prefix: 'color: #ffa500; font-weight: bold;',
    info: 'color: #12a0ff;',
    warn: 'color: #ffa500;',
    error: 'color: #ff0000;',
};

const xlog = (type: 'info' | 'warn' | 'error', message: string, details?: any) => {
    console.log(
        `%c[CrossSync] %c[${type.toUpperCase()}] %c${message}`,
        CROSSSYNC_CONSOLE_LOG_FORMAT.prefix,
        CROSSSYNC_CONSOLE_LOG_FORMAT[type],
        '',
    );
    if (details) {
        console.log(details);
    }
};

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
    xlog('info', 'Sync toggle button mounted.');
};

const syncPost = async () => {
    // if (!store.state.settings.syncing) {
    //     return;
    // }

    xlog('info', 'Sync triggered.');

    const username = (<HTMLAnchorElement>document.querySelector('main[role=main] a[role=link]'))?.pathname.replace(
        '/',
        '',
    );
    const tweet = (<HTMLElement>document.querySelector('[data-testid=tweetTextarea_0]'))?.innerText;

    const tweetAttachmentElements = document.querySelectorAll(
        '[data-testid="attachments"] img, [data-testid="attachments"] source',
    );

    const uploadedAttachments = await Promise.all(
        Array.from(tweetAttachmentElements).map(async (attachment) => {
            const result = await fetch((<HTMLImageElement | HTMLSourceElement>attachment).src);
            const blob = await result.blob();
            return {
                address: [await upload(blob)],
                mime_type: blob.type,
                size_in_bytes: blob.size,
            };
        }),
    );

    const twitItem = {
        tags: ['CrossSync', 'Twitter'],
        authors: [
            // `rss3://account:${store.state.settings.address}@ethereum`,
            `rss3://account:${username}@twitter`,
        ],
        summary: {
            content: tweet,
            mime_type: 'text/plain',
            size_in_bytes: tweet.length,
        },
        body: {
            content: tweet,
            mime_type: 'text/plain',
            size_in_bytes: tweet.length,
        },
        attachments: uploadedAttachments,
    };

    xlog('info', 'Posting tweet...', twitItem);
};

const keyEvent = (ev: KeyboardEvent) => {
    if (ev.key === 'Enter' && ev.ctrlKey) {
        syncPost();
    }
};

const addSyncEv = (el: Element) => {
    document.removeEventListener('keydown', keyEvent);
    document.addEventListener('keydown', keyEvent);

    el.removeEventListener('click', syncPost); // if any, prevent multiple trigger
    el.addEventListener('click', syncPost);

    xlog('info', 'Key sync added.');
};

export const hooks: {
    selector: string;
    callback: (el: Element) => void;
}[] = [
    {
        selector:
            'div[data-testid="primaryColumn"] div[data-testid="tweetButtonInline"], div[data-testid="tweetButton"]',
        callback: (el) => {
            mountSyncToggleApp(el);
            addSyncEv(el);
        },
    },
];
export default hooks;
