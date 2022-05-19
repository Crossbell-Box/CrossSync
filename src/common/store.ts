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
        setProvider(state, provider) {
            state.provider = new ethers.providers.Web3Provider(provider);
            const contract = new Contract(provider);
            state.crossbell.contract = markRaw(contract);
        },
    },
    actions: {
        async setProviderAndConnectContract({ commit, state }, provider) {
            if (provider) {
                commit('setProvider', provider);
                await state.crossbell.contract?.connect();
            }
        },
        async reset({ state }) {
            state.provider = undefined;
            state.crossbell.contract = undefined;
        },
    },
});

export function useStore() {
    return baseUseStore<State>(key);
}
