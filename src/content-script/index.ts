import '@/common/polyfill';
import { observe } from '@/common/utils';
import '@/common/locationChange';
import { connect as w3mConnect } from '@/common/wallet';
import Unidata from 'unidata.js';

import '../css/lib.css';

export interface Hook {
    selector: string;
    callback: (el: Element) => void;
}

class CrossSyncContentScript {
    private unidata: Unidata | undefined;

    constructor() {
        console.log('CorssSync Content Script is running');
        this.initHooks();
    }

    private async initHooks() {
        switch (new URL(window.location.href).host) {
            case 'twitter.com':
                const TwitterHook = (await import('./hooks/twitter')).default;
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
        if (!this.unidata) {
            try {
                const provider = await w3mConnect();
                if (provider) {
                    this.unidata = new Unidata({
                        ethereumProvider: provider,
                    });
                }
            } catch (e: any) {}
        }
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
        );
        if (details) {
            console.log(details);
        }
    }
}

new CrossSyncContentScript();

export default CrossSyncContentScript;
