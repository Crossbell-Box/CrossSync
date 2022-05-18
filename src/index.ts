import { createApp } from 'vue';
import Index from './Index.vue';
import IndexPage from './components/pages/Index.vue';
import ProfilePage from './components/pages/Profile.vue';
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
    ],
});

app.use(router);
app.mount('#app');
