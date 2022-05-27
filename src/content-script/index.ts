import '@/common/polyfill';
import { observe } from '@/common/utils';
import '@/common/locationChange';

import '../css/lib.css';

export interface Hook {
    selector: string;
    callback: (el: Element) => void;
}

class CrossSyncContentScript {
    constructor() {
        console.log('CorssSync Content Script is running');
        this.initHooks();
    }

    async initHooks() {
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
