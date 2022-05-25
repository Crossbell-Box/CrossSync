import { observe } from './utils';
import './locationChange';

import hooks from './hooks/twitter';

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
