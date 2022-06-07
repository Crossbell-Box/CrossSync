import { debounce } from 'lodash-es';

const interval = 200;
const maxCount = 10000 / interval;
export function observe(selector: string, callback: (ele: Element) => void, endless?: boolean) {
    let observer: MutationObserver;
    let cache: Element;
    const cb = (result: Element) => {
        if (result !== cache) {
            cache = result;
            callback(result);
        }
    };
    const run = () => {
        let currentCount = 0;
        const result = document.querySelector(selector);
        if (result && !endless) {
            cb(result);
        } else {
            if (observer) {
                observer.disconnect();
            }
            observer = new MutationObserver(
                debounce(() => {
                    const result = document.querySelector(selector);
                    if (!endless) {
                        if (result) {
                            observer.disconnect();
                            cb(result);
                        } else if (currentCount > maxCount) {
                            observer.disconnect();
                        } else {
                            currentCount++;
                        }
                    } else {
                        if (result) {
                            cb(result);
                        }
                    }
                }, interval),
            );
            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }
    };

    run();

    window.addEventListener('locationchange', () => {
        setTimeout(() => {
            run();
        }, 0);
    });
}
