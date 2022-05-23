import { createStore, Store, useStore as baseUseStore } from 'vuex';
import { InjectionKey, markRaw } from 'vue';
import { ethers } from 'ethers';
import { disconnect } from '@/common/wallet';
import { getBucket } from '@extend-chrome/storage';

interface Settings {
    syncing: boolean;
    address?: string;
    handle?: string;
}

export const bucket = getBucket<Settings>('settings', 'sync');

interface State {
    profiles?: Profiles;
    settings: Settings;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
    state: {
        profiles: undefined,
        settings: await bucket.get({
            syncing: true,
        }),
    },
    mutations: {},
    actions: {
        async getAddress({ dispatch, state }, provider) {
            provider = new ethers.providers.Web3Provider(provider);
            if (provider) {
                const address = await provider.getSigner().getAddress();
                state.settings.address = address;
                await bucket.set({
                    address: address,
                });
                await dispatch('getProfiles');
            }
        },
        async getProfiles({ state }) {
            if (state.settings.address) {
                state.profiles = await window.unidata!.profiles.get({
                    source: 'Crossbell Profile',
                    identity: state.settings.address,
                });
            }
        },
        async chooseProfile({ state }, handle) {
            state.settings.handle = handle;
            await bucket.set({
                handle: handle,
            });
        },
        async setSettings({ state }, settings: Partial<Settings>) {
            state.settings = Object.assign(state.settings, settings);
            await bucket.set(settings);
        },
        async reset({ state }) {
            await disconnect();
            state.profiles = undefined;
            state.settings = {
                syncing: true,
            };
            await bucket.clear();
        },
        async setSyncing({ commit, dispatch, state }, syncing: boolean) {
            state.settings.syncing = syncing;
            await bucket.set({
                syncing: syncing,
            });
        },
    },
});

export function useStore() {
    return baseUseStore<State>(key);
}
