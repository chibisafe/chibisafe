import 'media-chrome';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createMetaManager } from 'vue-meta';
import App from './App.vue';
import router from './router';

const mount = async () => {
	const app = createApp(App).use(createPinia()).use(router).use(createMetaManager()).use(VueQueryPlugin);
	await router.isReady();
	app.mount('#app');
};

void mount();
