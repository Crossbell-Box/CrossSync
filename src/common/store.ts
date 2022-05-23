import { createStore, Store, useStore as baseUseStore } from 'vuex';
import { InjectionKey, markRaw } from 'vue';
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
        async setSettings({ state }, settings: Partial<Settings>) {
            if (settings.address && settings.address !== state.settings.address) {
                state.profiles = await window.unidata!.profiles.get({
                    source: 'Crossbell Profile',
                    identity: settings.address,
                });
            }

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
    },
});

export function useStore() {
    return baseUseStore<State>(key);
}
