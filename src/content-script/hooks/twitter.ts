import Main, { Hook } from '../index';
import { createApp, App } from 'vue';
import ElementPlus, { ElMessage, MessageHandle } from 'element-plus';

import { upload } from '@/common/ipfs';
import { bucket, getSettings, key, store } from '@/common/store';

import SyncToggleButton from '@/components/SyncToggle.vue';
import type { NoteInput } from 'unidata.js/dist/types/notes';

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
                callback: async (el) => {
                    this.detectStatus();
                    this.mountSyncToggleApp(el);
                },
            },
        ];

        let startPromise: Promise<NoteInput> | undefined;
        let notice: MessageHandle | undefined;
        chrome.runtime.onMessage.addListener(async (msg) => {
            if (msg.type === 'create-tweet-start') {
                startPromise = new Promise(async (resolve) => {
                    const settings = await getSettings();
                    const handle = settings.handle;
                    const syncing = settings.syncing;

                    if (handle && syncing === true) {
                        this.main.xlog('info', 'Sync triggered.');

                        notice = ElMessage.warning({
                            dangerouslyUseHTMLString: true,
                            message:
                                '<p>CrossSync is syncing your posting...</p><p style="margin-top: 7px;font-size: 12px;">(1/2) Uploading posting to IPFS</p>',
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

                if (handle && syncing === true) {
                    if (startPromise) {
                        const note = await startPromise;
                        const link = document.querySelector('time')?.parentElement?.getAttribute('href');
                        note.related_urls = [`https://twitter.com${link}`];

                        this.main.xlog('info', 'Posting tweet...', note);

                        notice?.close();
                        notice = ElMessage.warning({
                            dangerouslyUseHTMLString: true,
                            message:
                                '<p>CrossSync is syncing your posting...</p><p style="margin-top: 7px;font-size: 12px;">(2/2) Waiting for signature and transaction on Crossbell</p>',
                            duration: 0,
                        });

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

        try {
            // Not working :(
            window.ethereum?.on('accountsChanged', this.detectStatus);
        } catch (e) {
            this.main.xlog('error', 'Failed to add account change event listener.', e);
        }
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

            // update SyncToggle.vue
            (<any>window).cssc?.checkAvailable?.();
        }
        this.main.xlog('info', 'Sync toggle button mounted.');
    }

    private async detectStatus() {
        // Detect if account is changed or balance insufficient
        this.main.xlog('info', 'Detect status...');
        const settings = await getSettings();
        // this.main.xlog('info', 'Settings is', settings);
        const unidata = await this.main.getUnidata();
        // this.main.xlog('info', 'Now address is: '+ this.main.address);
        let newStatus = '';
        if (settings.syncing !== false && settings.address) {
            if (settings.address.toLowerCase() !== this.main.address?.toLowerCase()) {
                newStatus = 'Address changed.';
                // this.main.xlog('info', 'Old address: ', settings.address);
                // this.main.xlog('info', 'Now address: ', this.main.address);
                // } else if (unidata) { // Disabled for unidata.utils.contract is undefined
                //     settings.syncing = true;
                //     const balance = (await unidata.utils.contract.getBalance(this.main.address)).data;
                //     if (parseInt(balance) < 0.0005 * Math.pow(10, 18)) {
                //         newStatus = 'Balance might not enough.';
                //     }
            }
            if (newStatus !== '') {
                this.main.xlog('warn', newStatus);
                settings.syncing = newStatus;
                await bucket.set(settings);
            } else {
                if (typeof settings.syncing === 'string') {
                    settings.syncing = true;
                    await bucket.set(settings);
                }
            }
        }
    }
}

export default TwitterHook;
