import { createStore, Store, useStore as baseUseStore } from 'vuex';
import { InjectionKey } from 'vue';
import { disconnect } from '@/common/wallet';
import { getBucket } from '@extend-chrome/storage';
import Unidata from 'unidata.js';

export interface Settings {
    syncing: boolean | string;
    address?: string;
    handle?: string;
}

export const bucket = getBucket<Settings>('settings', 'sync');

export const getSettings = async (): Promise<Settings> =>
    Object.assign(
        {
            syncing: true,
        },
        await bucket.get(),
    );

const settings = await getSettings();

interface State {
    characters?: Characters;
    settings: Settings;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
    state: {
        settings: settings,
        characters: settings.address
            ? await new Unidata().characters.get({
                  source: 'Crossbell Character',
                  identity: settings.address,
              })
            : undefined,
    },
    mutations: {},
    actions: {
        async setSettings({ state }, settings: Partial<Settings>) {
            if (settings.address && settings.address !== state.settings.address) {
                state.characters = await window.unidata!.characters.get({
                    source: 'Crossbell Character',
                    identity: settings.address,
                });
            }

            state.settings = Object.assign(state.settings, settings);
            await bucket.set(settings);
        },
        async reset({ state }) {
            await disconnect();
            state.characters = undefined;
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
