import Main, { Hook } from '../index';
import { createApp, App } from 'vue';
import ElementPlus, { ElMessage } from 'element-plus';
import bind from 'bind-decorator';

import { upload } from '@/common/ipfs';
import { getSettings, key, store } from '@/common/store';

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
                syncToggleApp.use(store, key);

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
        const settings = await getSettings();
        const handle = settings.handle;
        const syncing = settings.syncing;

        if (handle && syncing) {
            this.main.xlog('info', 'Sync triggered.');

            const notice = ElMessage.info({
                message: 'Sync posting, please wait for Wallet to open...',
                duration: 0,
            });

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
                authors: [`csb://account:${username}@twitter`],
                body: {
                    content: tweet,
                    mime_type: 'text/plain',
                    size_in_bytes: tweet.length,
                },
                attachments: uploadedAttachments,
            };

            this.main.xlog('info', 'Posting tweet...', twitItem);

            const unidata = await this.main.getUnidata();
            if (unidata) {
                try {
                    await unidata.notes.set(
                        {
                            source: 'Crossbell Note',
                            identity: handle,
                            platform: 'Crossbell',
                            action: 'add',
                        },
                        twitItem,
                    );
                    ElMessage.success('Tweet posted! 🎉');
                } catch (e) {
                    this.main.xlog('error', 'Failed to post tweet.', e);
                    ElMessage.error('Oops, failed to post tweet.');
                }
            } else {
                this.main.xlog('info', `Failed to get Unidata Instance.`);
                ElMessage.error('Oops, Unidata Instance is not ready.');
            }

            notice.close();
        }
    }
}

export default TwitterHook;
