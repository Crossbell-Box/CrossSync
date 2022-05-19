import { createStore, useStore as baseUseStore, Store } from 'vuex';
import { InjectionKey } from 'vue';
// import Unidata from "unidata.js"; // error TS7016: Could not find a declaration file for module 'unidata.js'
import { ethers } from 'ethers';

interface State {
    // unidata?: Unidata;
    provider?: ethers.providers.Web3Provider;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
    state: {
        // unidata: undefined,
        provider: undefined,
    },
    mutations: {
        setProvider(state, provider) {
            state.provider = new ethers.providers.Web3Provider(provider);
        },
    },
});

export function useStore() {
    return baseUseStore<State>(key);
}
