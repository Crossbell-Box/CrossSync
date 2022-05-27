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
                },
            },
        ];

        let startPromise: Promise<Partial<Note>> | undefined;
        let notice: ElMessage | undefined;
        chrome.runtime.onMessage.addListener(async (msg) => {
            if (msg.type === 'create-tweet-start') {
                startPromise = new Promise(async (resolve) => {
                    const settings = await getSettings();
                    const handle = settings.handle;
                    const syncing = settings.syncing;

                    if (handle && syncing) {
                        this.main.xlog('info', 'Sync triggered.');

                        notice = ElMessage.info({
                            message: 'CrossSync is syncing your posting...',
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

                        resolve({
                            tags: ['CrossSync', 'Twitter'],
                            authors: [`csb://account:${username}@twitter`],
                            body: {
                                content: tweet,
                                mime_type: 'text/plain',
                                size_in_bytes: tweet.length,
                            },
                            attachments: uploadedAttachments,
                        });
                    }
                });
                startPromise.catch((err) => {
                    ElMessage.error(`CrossSync encountered a problem: ${err.message}`);
                });
            } else if (msg.type === 'create-tweet-end') {
                const settings = await getSettings();
                const handle = settings.handle;
                const syncing = settings.syncing;

                if (handle && syncing) {
                    if (startPromise) {
                        const note = await startPromise;
                        const link = document.querySelector('time')?.parentElement?.getAttribute('href');
                        note.related_urls = [`https://twitter.com${link}`];

                        this.main.xlog('info', 'Posting tweet...', note);

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
                                    note,
                                );
                                ElMessage.success('CrossSync has successfully synced your posting to blockchain! 🎉');
                            } catch (e) {
                                this.main.xlog('error', 'Failed to post note.', e);
                                ElMessage.error('CrossSync encountered a problem: Unidata failed to post note.');
                            }
                        } else {
                            this.main.xlog('info', `Failed to get Unidata Instance.`);
                            ElMessage.error('CrossSync encountered a problem: Unidata instance is not ready.');
                        }

                        notice?.close();
                    } else {
                        this.main.xlog('info', `Failed to find note info.`);
                        ElMessage.error('CrossSync encountered a problem: Failed to find note info.');
                    }
                }
            }
        });
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
}

export default TwitterHook;
