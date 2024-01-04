import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '~/store';
import routes from '~pages';

const router = createRouter({
	history: createWebHistory(),
	routes
});

router.beforeEach(async (to, _, next) => {
	const userStore = useUserStore();
	if (!userStore.user.loggedIn) {
		await userStore.checkToken();
	}

	if (to.path.startsWith('/dashboard') && !userStore.user.loggedIn) {
		next('/login');
		return;
	}

	next();
});

export default router;
