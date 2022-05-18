import { createApp } from 'vue';
import Index from './Index.vue';

import IndexPage from './pages/Index.vue';
import MintPage from './pages/Mint.vue';
import ProfilesPage from './pages/Profiles.vue';
import HomePage from './pages/Home.vue';
import NotePage from './pages/Note.vue';

import { createRouter, createWebHashHistory } from 'vue-router';

import 'element-plus/dist/index.css';
import './index.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPenToSquare, faLink } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faTwitter, faTelegram, faDiscord, faReddit } from '@fortawesome/free-brands-svg-icons';

library.add(faPenToSquare, faLink, faGithub, faTwitter, faTelegram, faDiscord, faReddit);

const app = createApp(Index);

const router = createRouter({
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
    ],
});

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);
app.mount('#app');
