import { createStore, Store, useStore as baseUseStore } from 'vuex';
import { InjectionKey, markRaw } from 'vue';
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
        async getAddress({ dispatch, state }, provider) {
            provider = new ethers.providers.Web3Provider(provider);
            if (provider) {
                state.address = await provider.getSigner().getAddress();
                await dispatch('getProfiles');
            }
        },
        async getProfiles({ state }) {
            const crossbellProfiles = await window.unidata!.profiles.get({
                source: 'Crossbell Profile',
                identity: state.address!,
            });
            const ensProfiles = await window.unidata!.profiles.get({
                source: 'ENS',
                identity: state.address!,
            });
            state.profiles = {
                total: crossbellProfiles.total + ensProfiles.total,
                list: [...crossbellProfiles.list, ...ensProfiles.list],
            };
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
