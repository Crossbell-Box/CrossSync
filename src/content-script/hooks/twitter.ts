import Main, { Hook } from '../index';
import { createApp, App } from 'vue';
import ElementPlus from 'element-plus';
import bind from 'bind-decorator';

import { upload } from '@/common/ipfs';
import { getSettings } from '@/common/store';

import SyncToggleButton from '@/components/SyncToggle.vue';

let syncToggleApp: App<Element> | null = null;
let crossSyncToggleEl: HTMLDivElement;

class TwitterHook {
    hooks: Hook[];
    main: Main;

    constructor(main: Main) {
        this.main = main;

        this.hooks = [
            {
                selector:
                    'div[data-testid="primaryColumn"] div[data-testid="tweetButtonInline"], div[data-testid="tweetButton"]',
                callback: (el) => {
                    this.mountSyncToggleApp(el);
                    this.addSyncEv(el);
                },
            },
        ];
    }

    private mountSyncToggleApp(el: Element) {
        if (el && el.parentNode) {
            if (!syncToggleApp) {
                syncToggleApp = createApp(SyncToggleButton);
                syncToggleApp.use(ElementPlus);

                crossSyncToggleEl = document.createElement('div');
                syncToggleApp.mount(crossSyncToggleEl);
            }

            el.parentNode.insertBefore(crossSyncToggleEl, el);
        }
        this.main.xlog('info', 'Sync toggle button mounted.');
    }

    private addSyncEv(el: Element) {
        const keyEvent = (ev: KeyboardEvent) => {
            if (ev.key === 'Enter' && ev.ctrlKey) {
                this.syncPost();
            }
        };

        document.removeEventListener('keydown', keyEvent);
        document.addEventListener('keydown', keyEvent);

        el.removeEventListener('click', this.syncPost); // if any, prevent multiple trigger
        el.addEventListener('click', this.syncPost);

        this.main.xlog('info', 'Key sync added.');
    }

    @bind
    private async syncPost() {
        const handle = (await getSettings()).handle;

        if (handle) {
            this.main.xlog('info', 'Sync triggered.');

            const username = (<HTMLAnchorElement>(
                document.querySelector('main[role=main] a[role=link]')
            ))?.pathname.replace('/', '');
            const tweet = (<HTMLElement>document.querySelector('[data-testid=tweetTextarea_0]'))?.innerText;

            const tweetAttachmentElements = document.querySelectorAll(
                '[data-testid="attachments"] img, [data-testid="attachments"] source',
            );

            const uploadedAttachments = await Promise.all(
                Array.from(tweetAttachmentElements).map(async (attachment) => {
                    const result = await fetch((<HTMLImageElement | HTMLSourceElement>attachment).src);
                    const blob = await result.blob();
                    return {
                        address: await upload(blob),
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
                body: {
                    content: tweet,
                    mime_type: 'text/plain',
                    size_in_bytes: tweet.length,
                },
                attachments: uploadedAttachments,
            };

            this.main.xlog('info', 'Posting tweet...', twitItem);
        } else {
            this.main.xlog('info', `Didn't find handle, sync skipped.`);
        }
    }
}

export default TwitterHook;
