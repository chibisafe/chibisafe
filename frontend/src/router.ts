// @ts-expect-error
import routes from 'virtual:generated-pages';
import { createRouter, createWebHistory } from 'vue-router';

export default createRouter({
	history: createWebHistory(),
	routes
});
