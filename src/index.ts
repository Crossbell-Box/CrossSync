import { createApp } from 'vue';
import Index from './Index.vue';

import IndexPage from './pages/init/Index.vue';
import ProfilePage from './pages/init/Profile.vue';
import IntroPage from './pages/init/Intro.vue';
import CreateProfilePage from './pages/init/CreateProfile.vue';
import FinishPage from './pages/init/Finish.vue';
import HomePage from './pages/main/Home.vue';
import DetailedNotePage from './pages/main/Detail.vue';

import { createRouter, createWebHistory } from 'vue-router';
import './index.css';

const app = createApp(Index);

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: IndexPage,
        },
        {
            path: '/profile',
            component: ProfilePage,
        },
        {
            path: '/intro',
            component: IntroPage,
        },
        {
            path: '/create-profile',
            component: CreateProfilePage,
        },
        {
            path: '/finish',
            component: FinishPage,
        },
        {
            path: '/home',
            component: HomePage,
        },
        {
            path: '/note/:id',
            component: DetailedNotePage,
        },
    ],
});

app.use(router);
app.mount('#app');
