import { createRouter, createWebHashHistory } from 'vue-router';

import IndexPage from '../pages/Index.vue';
import IndexRootPage from '../pages/IndexRoot.vue';
import MintPage from '../pages/Mint.vue';
import CharactersPage from '../pages/Characters.vue';
import FaucetPage from '../pages/Faucet.vue';
import Layout from '../pages/Layout.vue';
import HomePage from '../pages/Home.vue';
import NotePage from '../pages/Note.vue';
import SettingsPage from '../pages/Settings.vue';
import HelpPage from '../pages/Help.vue';

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: IndexPage,
            children: [
                {
                    path: '',
                    component: IndexRootPage,
                },
                {
                    path: 'mint',
                    component: MintPage,
                },
                {
                    path: 'characters',
                    component: CharactersPage,
                },
                {
                    path: 'faucet',
                    component: FaucetPage,
                },
            ],
        },
        {
            path: '/home',
            component: Layout,
            children: [
                {
                    path: '',
                    component: HomePage,
                },
                {
                    path: 'note/:id',
                    component: NotePage,
                },
                {
                    path: 'settings',
                    component: SettingsPage,
                },
                {
                    path: 'help',
                    component: HelpPage,
                },
            ],
        },
    ],
});
