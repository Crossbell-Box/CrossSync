import '@/common/polyfill';
import { observe } from '@/common/utils';
import '@/common/locationChange';
import { connect as w3mConnect } from '@/common/wallet';
import Unidata from 'unidata.js';
import TwitterHook from './hooks/twitter';
import AsyncLock from 'async-lock';

import '../css/lib.css';

export interface Hook {
    selector: string;
    callback: (el: Element) => void;
}

class CrossSyncContentScript {
    private unidata: Unidata | undefined;
    private lock: AsyncLock;

    address: string | undefined;

    constructor() {
        this.xlog('info', 'CorssSync Content Script is running');
        this.initHooks();
        this.lock = new AsyncLock();
    }

    private async initHooks() {
        switch (new URL(window.location.href).host) {
            case 'twitter.com':
                new TwitterHook(this).hooks.forEach((h) => {
                    observe(h.selector, h.callback);
                });
                break;
            default:
                // Not supported
                break;
        }
    }

    async getUnidata() {
        await this.lock.acquire('getUnidata', async () => {
            if (!this.unidata) {
                try {
                    const provider = await w3mConnect(); // Metamask
                    if (provider) {
                        this.address = (
                            await provider.request({
                                method: 'eth_accounts',
                            })
                        )?.[0];
                        // this.xlog('info', 'Init unidata with address: ', this.address);
                        this.unidata = new Unidata({
                            ethereumProvider: provider,
                        });
                    } else {
                        this.xlog('warn', 'No provider');
                    }
                } catch (e: any) {
                    this.xlog('error', 'Failed to initialize Unidata', e);
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
