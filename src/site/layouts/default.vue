<template>
	<nuxt />
</template>
<script>
import Vue from 'vue';
import Fuse from 'fuse.js';

const protectedRoutes = [
	'/dashboard',
	'/dashboard/albums',
	'/dashboard/settings'
];

export default {
	computed: {
		config() {
			return this.$store.state.config;
		}
	},
	mounted() {
		console.log(`%c lolisafe %c v${this.config.version} %c`, 'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#ff015b; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:transparent');
	},
	created() {
		Vue.prototype.$search = (term, list, options) => {
			return new Promise(resolve => {
				const run = new Fuse(list, options);
				const results = run.search(term);
				return resolve(results);
			});
		};

		Vue.prototype.$onPromiseError = (error, logout = false) => {
			this.processCatch(error, logout);
		};

		Vue.prototype.$showToast = (text, error, duration) => {
			this.showToast(text, error, duration);
		};

		Vue.prototype.$logOut = () => {
			this.$store.commit('user', null);
			this.$store.commit('loggedIn', false);
			this.$store.commit('token', null);
		};

		this.$router.beforeEach((to, from, next) => {
			if (this.$store.state.loggedIn) return next();
			if (process.browser) {
				if (localStorage && localStorage.getItem('lolisafe-token')) return this.tryToLogin(next, `/login?redirect=${to.path}`);
			}

			for (const match of to.matched) {
				if (protectedRoutes.includes(match.path)) {
					if (this.$store.state.loggedIn === false) return next(`/login?redirect=${to.path}`);
				}
			}

			return next();
		});
		if (process.browser) this.tryToLogin();
	},
	methods: {
		showToast(text, error, duration) {
			this.$toast.open({
				duration: duration || 2500,
				message: text,
				position: 'is-bottom',
				type: error ? 'is-danger' : 'is-success'
			});
		},
		processCatch(error, logout) {
			if (error.response && error.response.data && error.response.data.message) {
				this.showToast(error.response.data.message, true, 5000);
				if (error.response.status === 429) return;
				if (error.response.status === 502) return;
				if (logout) {
					this.$logOut();
					setTimeout(() => this.$router.push('/'), 3000);
				}
			} else {
				console.error(error);
				this.showToast('Something went wrong, please check the console :(', true, 5000);
			}
		},
		tryToLogin(next, destination) {
			if (process.browser) this.$store.commit('token', localStorage.getItem('lolisafe-token'));
			this.axios.get(`${this.config.baseURL}/verify`).then(res => {
				this.$store.commit('user', res.data.user);
				this.$store.commit('loggedIn', true);
				if (next) return next();
				return null;
			}).catch(error => {
				if (error.response && error.response.status === 520) return;
				if (error.response && error.response.status === 429) {
					setTimeout(() => {
						this.tryToLogin(next, destination);
					}, 1000);
					return next(false);
				}
				this.$store.commit('user', null);
				this.$store.commit('loggedIn', false);
				this.$store.commit('token', null);
				if (next && destination) return next(destination);
				if (next) return next('/');
				return null;
			});
		}
	}
};
</script>
<style lang="scss">
	@import "~/assets/styles/style.scss";
	@import "~assets/styles/icons.min.css";
</style>
