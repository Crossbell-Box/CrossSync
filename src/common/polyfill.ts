import { Buffer } from 'buffer';

window.Buffer = Buffer;

window.global = window;

(<any>window).process = {
    nextTick: (callback: any, ...args: any[]) => {
        setTimeout(() => {
            callback(...args);
        }, 0);
    },
    version: '',
    env: {},
};
