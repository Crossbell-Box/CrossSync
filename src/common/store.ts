import { createStore, Store, useStore as baseUseStore } from 'vuex';
import { InjectionKey, markRaw } from 'vue';
import { ethers } from 'ethers';
import { disconnect } from '@/common/wallet';

interface State {
    address?: string;
    profiles?: Profiles;
    handle?: string;
    settings: {
        syncing: boolean;
    };
}

export const key: InjectionKey<Store<State>> = Symbol();

const savedSettings = localStorage.getItem('settings');

export const store = createStore<State>({
    state: {
        address: undefined,
        profiles: undefined,
        handle: localStorage.getItem('handle') || '',
        settings: savedSettings
            ? JSON.parse(savedSettings)
            : {
                  syncing: false,
              },
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
            state.profiles = await window.unidata!.profiles.get({
                source: 'Crossbell Profile',
                identity: state.address!,
            });
        },
        async chooseProfile({ state }, handle) {
            state.handle = handle;
            localStorage.setItem('handle', handle);
        },
        async reset({ state }) {
            await disconnect();
            state.address = undefined;
            state.profiles = undefined;
            state.handle = undefined;
            localStorage.removeItem('handle');
        },
        saveSettings({ state }) {
            localStorage.setItem('settings', JSON.stringify(state.settings));
        },
        setSyncing({ commit, dispatch, state }, syncing: boolean) {
            state.settings.syncing = syncing;
            dispatch('saveSettings');
        },
    },
});

export function useStore() {
    return baseUseStore<State>(key);
}
