import Unidata from 'unidata.js';

declare global {
    interface Window {
        unidata: Unidata;
    }
}

export {};
