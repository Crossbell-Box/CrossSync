import { createStore, Store, useStore as baseUseStore } from 'vuex';
import { InjectionKey, markRaw } from 'vue';
// import Unidata from "unidata.js"; // error TS7016: Could not find a declaration file for module 'unidata.js'
import { ethers } from 'ethers';
import { Contract } from 'crossbell.js';

interface State {
    // unidata?: Unidata;
    provider?: ethers.providers.Web3Provider;
    crossbell: {
        contract?: Contract;
    };
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
    state: {
        // unidata: undefined,
        provider: undefined,
        crossbell: {
            contract: undefined,
        },
    },
    mutations: {
        async setProvider(state, provider) {
            state.provider = new ethers.providers.Web3Provider(provider);
            const contract = new Contract(provider);
            await contract.connect();
            state.crossbell.contract = markRaw(contract);
        },
    },
});

export function useStore() {
    return baseUseStore<State>(key);
}
