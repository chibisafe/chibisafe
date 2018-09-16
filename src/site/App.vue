<template>
	<div id="app"
		@dragover="isDrag = true"
		@dragend="isDrag = false"
		@dragleave="isDrag = false"
		@drop="isDrag = false">
		<router-view :key="$route.fullPath"/>

		<div v-if="!ready"
			id="loading">
			<div class="background"/>
			<Loading class="square"/>
		</div>

		<div v-if="false"
			id="drag-overlay">
			<div class="background"/>
			<div class="drop">
				Drop your files here
			</div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue';
import Fuse from 'fuse.js';
import Logo from './components/logo/Logo.vue';
import Loading from './components/loading/CubeShadow.vue';

const protectedRoutes = [
	'/dashboard',
	'/dashboard/albums',
	'/dashboard/settings'
];

export default {
	components: {
		Loading,
		Logo
	},
	async getInitialData({ route, store }) {
		try {
			const res = await this.axios.get(`/api/config`);
			Vue.prototype.$config = res.data;
			await store.commit('config', res.data);
			return { config: res.data };
		} catch (error) {
			return {};
		}
	},
	data() {
		return {
			pageTitle: '',
			ready: false,
			isDrag: false
		};
	},
	computed: {
		user() {
			return this.$store.state.user;
		},
		loggedIn() {
			return this.$store.state.loggedIn;
		},
		config() {
			return this.$store.state.config;
		}
	},
	mounted() {
		console.log(`%c Running lolisafe %c v${this.config.version} %c`, 'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#ff015b; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:transparent');
		this.ready = true;
	},
	metaInfo() { // eslint-disable-line complexity
		return {};
	},
	created() {
		/*
			Register our global handles
		*/
		const App = this; // eslint-disable-line consistent-this
		this.$store.commit('config', Vue.prototype.$config);
		Vue.prototype.$search = function(term, list, options) {
			return new Promise(resolve => {
				const run = new Fuse(list, options);
				const results = run.search(term);
				return resolve(results);
			});
		};

		Vue.prototype.$onPromiseError = function(error, logout = false) {
			App.processCatch(error, logout);
		};

		Vue.prototype.$showToast = function(text, error, duration) {
			App.showToast(text, error, duration);
		};

		Vue.prototype.$logOut = function() {
			App.$store.commit('user', null);
			App.$store.commit('loggedIn', false);
			App.$store.commit('token', null);
		};

		this.$router.beforeEach((to, from, next) => {
			if (this.$store.state.loggedIn) return next();
			if (localStorage.getItem('ls-token')) return this.tryToLogin(next, `/login?redirect=${to.path}`);

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
			this.$store.commit('token', localStorage.getItem('ls-token'));
			this.axios.get(`${this.$config.baseURL}/verify`).then(res => {
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
				} else {
					this.$store.commit('user', null);
					this.$store.commit('loggedIn', false);
					this.$store.commit('token', null);
					if (next && destination) return next(destination);
					if (next) return next('/');
					return null;
				}
			});
		}
	}
};
</script>

<style lang="scss">
	@import "./styles/style.scss";
</style>
