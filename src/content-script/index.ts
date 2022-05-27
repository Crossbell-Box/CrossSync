import '@/common/polyfill';
import { observe } from '@/common/utils';
import '@/common/locationChange';

import hooks from './hooks/twitter';

import '../css/lib.css';

(async () => {
    switch (new URL(window.location.href).host) {
        case 'twitter.com':
            hooks.forEach((h) => {
                observe(h.selector, h.callback);
            });
            break;
        default:
            // Not supported
            break;
    }
})();
