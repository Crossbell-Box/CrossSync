import '@/common/polyfill';
import { observe } from '@/common/utils';
import '@/common/locationChange';
import { connect as wConn } from '@/common/wallet';
import Unidata from 'unidata.js';
import TwitterHook from './hooks/twitter';
import AsyncLock from 'async-lock';

import '../css/lib.css';

export interface Hook {
    selector: string;
    callback: (el: Element) => void;
    endless?: boolean;
}

class CrossSyncContentScript {
    private unidata: Unidata | undefined;
    private lock: AsyncLock;

    address: string | undefined;

    constructor() {
        this.xlog('info', 'CorssSync Content Script is running');
        this.initHooks();
        this.lock = new AsyncLock();
        // Keep Service Worker Alive
        setInterval(() => {
            chrome.runtime.sendMessage({
                type: 'wakeup-sw',
            });
        }, 10 * 1000); // Per 10 seconds
    }

    private async initHooks() {
        switch (new URL(window.location.href).host) {
            case 'twitter.com':
                new TwitterHook(this).hooks.forEach((h) => {
                    observe(h.selector, h.callback, h.endless);
                });
                break;
            default:
                // Not supported
                break;
        }
    }

    async getUnidata(force: boolean = false, addressInSettings?: string) {
        await this.lock.acquire('getUnidata', async () => {
            if (!this.unidata) {
                try {
                    const provider = await wConn(force); // Metamask
                    if (provider) {
                        this.address =
                            (
                                await provider.request({
                                    method: 'eth_accounts',
                                })
                            )?.[0] || addressInSettings;
                        if (!this.address) {
                            throw new Error('No address found, MetaMask might be locked.');
                        }
                        // this.xlog('info', 'Init unidata with address: ', this.address);
                        this.unidata = new Unidata({
                            ethereumProvider: provider,
                        });
                    } else {
                        this.xlog('warn', 'No provider');
                    }
                } catch (e: any) {
                    this.xlog('error', 'Failed to initialize Unidata', e);
                    throw e;
                }
            }
        });
        return this.unidata;
    }

    xlog(type: 'info' | 'warn' | 'error', message: string, details?: any) {
        const CROSSSYNC_CONSOLE_LOG_FORMAT = {
            prefix: 'color: #ffa500; font-weight: bold;',
            info: 'color: #12a0ff;',
            warn: 'color: #ffa500;',
            error: 'color: #ff0000;',
        };

        console.log(
            `%c[CrossSync] %c[${type.toUpperCase()}] %c${message}`,
            CROSSSYNC_CONSOLE_LOG_FORMAT.prefix,
            CROSSSYNC_CONSOLE_LOG_FORMAT[type],
            '',
            details || '',
        );
    }
}

new CrossSyncContentScript();

export default CrossSyncContentScript;
