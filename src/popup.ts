import { createApp } from 'vue';
import Popup from './Popup.vue';
import ElementPlus from 'element-plus';

import './css/lib.css';
import './css/font.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPenToSquare, faLink } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faTwitter, faTelegram, faDiscord, faReddit } from '@fortawesome/free-brands-svg-icons';

import { router } from './common/router';
import { store, key } from './common/store';

library.add(faPenToSquare, faLink, faGithub, faTwitter, faTelegram, faDiscord, faReddit);

const app = createApp(Popup);

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);
app.use(store, key);
app.use(ElementPlus);
app.mount('#app');
