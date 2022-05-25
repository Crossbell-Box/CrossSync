import { createApp } from 'vue';
import Popup from './Popup.vue';
import './css/lib.css';
import './css/font.css';
import ElementPlus from 'element-plus';

import './css/lib.css';
import './css/font.css';

const app = createApp(Popup);

app.use(ElementPlus);
app.mount('#app');
