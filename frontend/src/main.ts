import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createMetaManager } from 'vue-meta';

// @ts-ignore
import App from './App.vue';
import router from './router';

const mount = async () => {
	const app = createApp(App).use(createPinia()).use(router).use(createMetaManager());
	await router.isReady();
	app.mount('#app');
};
void mount();
