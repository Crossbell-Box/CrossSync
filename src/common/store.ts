import { createStore, Store, useStore as baseUseStore } from 'vuex';
import { InjectionKey, markRaw } from 'vue';
import Unidata from 'unidata.js';
import { ethers } from 'ethers';

interface State {
    address?: string;
    profiles?: Profiles;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
    state: {
        address: undefined,
        profiles: undefined,
    },
    mutations: {},
    actions: {
        async getAddress({ commit, state }, provider) {
            provider = new ethers.providers.Web3Provider(provider);
            if (provider) {
                state.address = await provider.getSigner().getAddress();
                await store.dispatch('getProfiles');
            }
        },
        async getProfiles({ commit, state }, provider) {
            state.profiles = await window.unidata?.profiles.get({
                source: 'Crossbell Profile',
                identity: state.address!,
            });
        },
        async reset({ state }) {
            state.address = undefined;
            state.profiles = undefined;
        },
    },
});

export function useStore() {
    return baseUseStore<State>(key);
}
