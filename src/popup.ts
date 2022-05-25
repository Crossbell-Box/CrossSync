import { createApp } from 'vue';
import Popup from './Popup.vue';
import './index.css';
import ElementPlus from 'element-plus';

const app = createApp(Popup);

app.use(ElementPlus);
app.mount('#app');
