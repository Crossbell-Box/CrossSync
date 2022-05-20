import { createRouter, createWebHashHistory } from 'vue-router';

import IndexPage from '../pages/Index.vue';
import MintPage from '../pages/Mint.vue';
import ProfilesPage from '../pages/Profiles.vue';
import HomePage from '../pages/Home.vue';
import NotePage from '../pages/Note.vue';
import SettingsPage from '../pages/Settings.vue';

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: IndexPage,
        },
        {
            path: '/mint',
            component: MintPage,
        },
        {
            path: '/profiles',
            component: ProfilesPage,
        },
        {
            path: '/home',
            component: HomePage,
        },
        {
            path: '/note/:id',
            component: NotePage,
        },
        {
            path: '/settings',
            component: SettingsPage,
        },
    ],
});
