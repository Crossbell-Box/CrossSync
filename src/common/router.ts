import { createRouter, createWebHashHistory } from 'vue-router';

import IndexPage from '../pages/Index.vue';
import IndexRootPage from '../pages/IndexRoot.vue';
import MintPage from '../pages/Mint.vue';
import ProfilesPage from '../pages/Profiles.vue';
import HomePage from '../pages/Home.vue';
import HomeRootPage from '../pages/HomeRoot.vue';
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
                    path: 'profiles',
                    component: ProfilesPage,
                },
            ],
        },
        {
            path: '/home',
            component: HomePage,
            children: [
                {
                    path: '',
                    component: HomeRootPage,
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
