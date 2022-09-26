import Main, { Hook } from '../index';
import { createApp, App } from 'vue';
import ElementPlus, { ElMessage, MessageHandler } from 'element-plus';

import { upload } from '@/common/ipfs';
import { bucket, getSettings, key, store } from '@/common/store';

import SyncToggleButton from '@/components/SyncToggle.vue';
import SyncStatus from '@/components/SyncStatus.vue';
import type { NoteInput } from 'unidata.js';

let syncToggleApp: App<Element> | null = null;
let crossSyncToggleEl: HTMLDivElement;

class TwitterHook {
    hooks: Hook[];
    private main: Main;
    private noteCache: Map<string, NoteInput>;

    constructor(main: Main) {
        this.main = main;
        this.noteCache = new Map();

        this.hooks = [
            {
                selector:
                    'div[data-testid="primaryColumn"] div[data-testid="tweetButtonInline"], div[data-testid="tweetButton"]',
                callback: async (el) => {
                    this.detectStatus();
                    this.mountSyncToggleApp(el);
                },
            },
            {
                selector: '[data-testid="tweet"]',
                callback: async (el) => {
                    this.mountSyncOldTweets();
                },
                endless: true,
            },
        ];

        let startPromise:
            | Promise<{
                  note: NoteInput;
                  for_uri?: string;
              }>
            | undefined;
        chrome.runtime.onMessage.addListener(async (msg) => {
            if (msg.type === 'create-tweet-start') {
                const for_uri = msg.for_uri;
                startPromise = new Promise(async (resolve) => {
                    const settings = await getSettings();
                    const handle = settings.handle;
                    const syncing = settings.syncing;

                    if (handle && syncing === true) {
                        this.main.xlog('info', 'Sync triggered.');

                        const tweet =
                            msg.tweet_text || // Get directly from request
                            (<HTMLElement>document.querySelector('[data-testid=tweetTextarea_0]'))?.innerText; // Grab from frontend

                        const attachmentUrls = Array.from(
                            document.querySelectorAll(
                                '[data-testid="attachments"] img[src^="blob:https://twitter.com/"], [data-testid="attachments"] source',
                            ),
                        ).map((attachment) => {
                            return (<HTMLImageElement | HTMLSourceElement>attachment).src;
                        });

                        const attachments = await this.uploadAttachments(attachmentUrls);

                        resolve({
                            note: {
                                tags: ['CrossSync', 'Twitter'],
                                applications: ['CrossSync', 'Twitter'],
                                authors: [`csb://account:${this.getUsername()}@twitter`],
                                body: {
                                    content: tweet,
                                    mime_type: 'text/plain',
                                    size_in_bytes: tweet.length,
                                },
                                attachments,
                            },
                            for_uri,
                        });
                    }
                });
                startPromise.catch((err) => {
                    ElMessage.error(`CrossSync encountered a problem: ${err.message}`);
                });
            } else if (msg.type === 'create-tweet-end') {
                if (startPromise) {
                    const { note, for_uri } = await startPromise;

                    setTimeout(() => {
                        const tweet = document.querySelector('[data-testid="tweet"]');
                        const link = tweet?.querySelector('time')?.parentElement?.getAttribute('href');
                        if (link && link.includes(this.getUsername())) {
                            note.related_urls = [`https://twitter.com${link}`];
                        } else {
                            this.main.xlog('error', 'Failed to get link for: ', tweet);
                        }

                        this.main.xlog('info', 'Trigger auto posting tweet...', note);

                        this.sync(note, undefined, for_uri);
                    }, 10);
                } else {
                    this.main.xlog('info', `Failed to find note info.`);
                    ElMessage.error({
                        message: 'CrossSync encountered a problem: Failed to find note info.',
                        grouping: true,
                    });
                }
            }
        });

        // Listen on MetaMask account change Event
        try {
            // Not working :(
            this.main.xlog('info', 'Add MetaMask account change listener.');
            window.ethereum?.on('accountsChanged', this.detectStatus);
        } catch (e) {
            this.main.xlog('error', 'Failed to add account change event listener.', e);
        }
    }

    private async sync(note: NoteInput, attachmentUrls?: string[], for_uri?: string) {
        if (!(<any>window).cssc) {
            (<any>window).cssc = {};
        }
        const url = note.related_urls?.[0];
        (<any>window).cssc.syncing = url;
        (<any>window).cssc.updateSyncing?.[url || '']?.('syncing');

        const settings = await getSettings();
        const handle = settings.handle;
        const syncing = settings.syncing;
        let notice: MessageHandler | undefined;

        if (handle && syncing === true) {
            if (attachmentUrls) {
                note.attachments = await this.uploadAttachments(attachmentUrls);
            }

            this.main.xlog('info', 'Posting tweet...', note);

            notice?.close();
            notice = ElMessage.warning({
                dangerouslyUseHTMLString: true,
                message:
                    '<p>CrossSync is syncing your post...</p><p style="margin-top: 7px;font-size: 12px;">(2/2) Waiting for signature and transaction on Crossbell</p>',
                duration: 0,
                grouping: true,
            });

            const unidata = await this.main.getUnidata(true, settings.address);
            if (unidata) {
                try {
                    const data = await unidata.notes.set(
                        {
                            source: 'Crossbell Note',
                            identity: handle,
                            platform: 'Crossbell',
                            action: 'add',
                        },
                        note,
                        {
                            targetUri: for_uri,
                        },
                    );
                    ElMessage.success({
                        message: 'CrossSync has successfully synced your post to blockchain! 🎉',
                        grouping: true,
                    });

                    if (data.code !== 0) {
                        ElMessage.error(`CrossSync encountered a problem: ${data.message}`);
                    }
                } catch (e) {
                    this.main.xlog('error', 'Failed to post note.', e);
                    ElMessage.error({
                        message: 'CrossSync encountered a problem: Unidata failed to post note.',
                        grouping: true,
                    });

                    (<any>window).cssc.syncing = null;
                    (<any>window).cssc.updateSyncing?.[url || '']?.('synced');
                }
            } else {
                this.main.xlog('info', `Failed to get Unidata Instance.`);
                ElMessage.error({
                    message: 'CrossSync encountered a problem: Unidata instance is not ready.',
                    grouping: true,
                });
            }

            notice?.close();

            (<any>window).cssc.syncing = null;
            (<any>window).cssc.updateSyncing?.[url || '']?.('synced');
        }
    }

    private async uploadAttachments(attachmentUrls: string[]) {
        const settings = await getSettings();
        const handle = settings.handle;
        const syncing = settings.syncing;
        let notice: MessageHandler | undefined;
        if (handle && syncing === true) {
            // attachments
            notice = ElMessage.warning({
                dangerouslyUseHTMLString: true,
                message:
                    '<p>CrossSync is syncing your post...</p><p style="margin-top: 7px;font-size: 12px;">(1/2) Uploading post attachments to IPFS</p>',
                duration: 0,
                grouping: true,
            });

            const attachments = (
                await Promise.all(
                    Array.from(attachmentUrls).map(async (attachment) => {
                        const result = await fetch(attachment);
                        const blob = await result.blob();
                        try {
                            return {
                                address: await upload(blob),
                                mime_type: blob.type,
                                size_in_bytes: blob.size,
                            };
                        } catch (e) {
                            this.main.xlog('error', 'Failed to upload to IPFS with error: ', e);
                            return {
                                address: '',
                            };
                        }
                    }),
                )
            ).filter((attachment) => attachment.address !== '');

            notice?.close();

            return attachments;
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
        let newStatus = '';
        try {
            await this.main.getUnidata(false, settings.address);
        } catch (e: any) {
            newStatus = e.message;
            this.main.xlog('warn', newStatus);
            settings.syncing = newStatus;
            await bucket.set(settings);
            return;
        }
        // this.main.xlog('info', 'Now address is: '+ this.main.address);
        if (settings.syncing !== false && settings.address && this.main.address) {
            if (settings.address.toLowerCase() !== this.main.address.toLowerCase()) {
                newStatus = 'Address changed.';
                this.main.xlog('warn', `Old address: ${settings.address}, now: ${this.main.address}`);
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

    private getUsername(): string {
        const link = (<HTMLAnchorElement>document.querySelector('[data-testid="AppTabBar_Profile_Link"]'))?.pathname;
        return link.split('/')[1];
    }

    private async mountSyncOldTweets() {
        // Only activate on Personal Timeline
        const username = this.getUsername();
        const settings = await getSettings();

        this.main.xlog('info', 'Mounting sync old tweets button...');

        // All tweets
        const allTweets = document.querySelectorAll('[data-testid="tweet"]');
        allTweets.forEach((tweet) => {
            if (tweet && !tweet.querySelector('[cssc="sync-status"]')) {
                // Get link
                const tweetPath = tweet.querySelector('time')?.parentElement?.getAttribute('href');
                if (tweetPath && tweetPath.includes(`/${username}/status/`)) {
                    const link = `https://twitter.com${tweetPath}`;

                    const syncStatus = createApp(SyncStatus, {
                        link: link,
                        getNote: async () => {
                            if (this.noteCache.has(link)) {
                                return this.noteCache.get(link);
                            } else {
                                // Check if it's already synced
                                const unidata = await this.main.getUnidata(false, settings.address);
                                const noteResp = await unidata?.notes.get({
                                    source: 'Crossbell Note',
                                    filter: {
                                        url: link,
                                    },
                                });
                                if (noteResp?.list[0]) {
                                    this.noteCache.set(link, noteResp?.list[0]);
                                }
                                return noteResp?.list[0];
                            }
                        },
                        postNote: async () => {
                            // Get tweet data
                            const tweetTextNode = tweet.querySelector('[data-testid="tweetText"]');
                            let tweetText = tweetTextNode?.textContent || '';
                            const tweetTextAnchors = tweetTextNode?.querySelectorAll('a');
                            // Get full url for all links
                            const tweetTextLinks = tweetTextAnchors
                                ? Array.from(tweetTextAnchors)
                                      .map((a) => a.textContent)
                                      .filter((link) => !!link)
                                : [];

                            // Remove final '…'
                            tweetTextLinks.forEach((link) => {
                                tweetText = tweetText.replace(link!, link!.replace('…', ''));
                            });

                            const tweetMedia = [
                                ...Array.from(
                                    tweet.querySelectorAll(
                                        `a[href^="/${username}/status/"] [data-testid="tweetPhoto"] img`,
                                    ),
                                ).map((img) => img.getAttribute('src')),
                                ...Array.from(tweet.querySelectorAll('[data-testid="videoPlayer"] video')).map(
                                    (video) => video.getAttribute('poster'),
                                ),
                            ].filter((url) => !!url) as string[];

                            const note = {
                                tags: ['CrossSync', 'Twitter'],
                                applications: ['CrossSync', 'Twitter'],
                                authors: [`csb://account:${username}@twitter`],
                                body: {
                                    content: tweetText,
                                    mime_type: 'text/plain',
                                    size_in_bytes: tweetText.length,
                                },
                                related_urls: [link],
                            };

                            await this.sync(note, tweetMedia);
                        },
                    });
                    syncStatus.use(ElementPlus);
                    syncStatus.use(store, key);

                    const syncStatusContainer = document.createElement('div');
                    syncStatus.mount(syncStatusContainer);

                    const moreButton = tweet.querySelector('[data-testid="caret"]');
                    if (moreButton && moreButton.parentNode) {
                        moreButton.parentNode.insertBefore(syncStatusContainer, moreButton);
                    } // else: what?
                } // else Unable to find link, skip
            }
        });
    }
}

export default TwitterHook;
