import { observe } from './utils';
import './locationChange';

// import syncControl from '@/common/sync-control';

import { hooks as twitterHooks } from './hooks/twitter';

(async () => {
    switch (new URL(window.location.href).host) {
        case 'twitter.com':
            twitterHooks.forEach((h) => {
                observe(h.selector, h.callback);
            });
            break;
        default:
            // Not supported
            break;
    }
})();
