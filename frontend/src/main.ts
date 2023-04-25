import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createMetaManager } from 'vue-meta';
import { debug } from './use/log';

import 'media-chrome';

// @ts-ignore
import App from './App.vue';
import router from './router';

declare global {
	// eslint-disable-next-line no-var, vars-on-top, @typescript-eslint/ban-types
	var debug: Function;
}
globalThis.debug = debug;

const mount = async () => {
	const app = createApp(App).use(createPinia()).use(router).use(createMetaManager());
	await router.isReady();
	app.mount('#app');
};

void mount();
