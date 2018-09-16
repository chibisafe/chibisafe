import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
	mode: 'history',
	routes: [
		{ path: '/', component: () => import('../views/Home.vue') },
		{ path: '/login', component: () => import('../views/Auth/Login.vue') },
		{ path: '/register', component: () => import('../views/Auth/Register.vue') },
		{ path: '/dashboard', component: () => import('../views/Dashboard/Uploads.vue') },
		{ path: '/dashboard/albums', component: () => import('../views/Dashboard/Albums.vue') },
		{ path: '/dashboard/settings', component: () => import('../views/Dashboard/Settings.vue') },
		{ path: '*', component: () => import('../views/NotFound.vue') }
	]
});

export default router;
