<template>
	<div id="app"
		@dragover="isDrag = true"
		@dragend="isDrag = false"
		@dragleave="isDrag = false"
		@drop="isDrag = false">
		<router-view :key="$route.fullPath"/>

		<!--
		<div v-if="!ready"
			id="loading">
			<div class="background"/>
			<Loading class="square"/>
		</div>
		-->
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
		this.$store.commit('config', Vue.prototype.$config);
		this.ready = true;
	},
	metaInfo() { // eslint-disable-line complexity
		return {
			title: this.pageTitle || 'A small safe worth protecting.',
			titleTemplate: '%s | lolisafe',
			link: [
				{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Nunito:300,400,600,700', body: true },
				{ rel: 'stylesheet', href: 'https://cdn.materialdesignicons.com/2.1.99/css/materialdesignicons.min.css', body: true },

				{ rel: 'apple-touch-icon', sizes: '180x180', href: '/public/images/icons/apple-touch-icon.png' },
				{ rel: 'icon', type: 'image/png', sizes: '32x32', href: '/public/images/icons/favicon-32x32.png' },
				{ rel: 'icon', type: 'image/png', sizes: '16x16', href: '/public/images/icons/favicon-16x16.png' },
				{ rel: 'manifest', href: '/public/images/icons/manifest.json' },
				{ rel: 'mask-icon', color: '#FF015B', href: '/public/images/icons/safari-pinned-tab.svg' },
				{ rel: 'shortcut icon', href: '/public/images/icons/favicon.ico' },
				{ rel: 'chrome-webstore-item', href: 'https://chrome.google.com/webstore/detail/bjhaeboalljjbggiljjokojcedhmkfoa' },
				{ type: 'application/json+oembed', href: 'https://listen.moe/public/oembed.json' }
			],
			meta: [
				{ vmid: 'theme-color', name: 'theme-color', content: '#FF015B' },

				{ vmid: 'description', name: 'description', content: 'A modern and self-hosted file upload service that can handle anything you throw at it. Fast uploads, file manager and sharing capabilities all crafted with a beautiful user experience in mind.' },
				{ vmid: 'keywords', name: 'keywords', content: 'lolisafe, file, upload, uploader, vue, node, open source, free' },

				{ vmid: 'apple-mobile-web-app-title', name: 'apple-mobile-web-app-title', content: 'lolisafe' },
				{ vmid: 'application-name', name: 'application-name', content: 'lolisafe' },
				{ vmid: 'msapplication-config', name: 'msapplication-config', content: '/public/images/icons/browserconfig.xml' },

				{ vmid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
				{ vmid: 'twitter:site', name: 'twitter:site', content: '@its_pitu' },
				{ vmid: 'twitter:creator', name: 'twitter:creator', content: '@its_pitu' },
				{ vmid: 'twitter:title', name: 'twitter:title', content: `lolisafe` },
				{ vmid: 'twitter:description', name: 'twitter:description', content: 'A modern and self-hosted file upload service that can handle anything you throw at it. Fast uploads, file manager and sharing capabilities all crafted with a beautiful user experience in mind.' },
				{ vmid: 'twitter:image', name: 'twitter:image', content: 'https://listen.moe/public/images/share.jpg' },

				{ vmid: 'og:url', property: 'og:url', content: 'https://listen.moe' },
				{ vmid: 'og:type', property: 'og:type', content: 'website' },
				{ vmid: 'og:title', property: 'og:title', content: `lolisafe` },
				{ vmid: 'og:description', property: 'og:description', content: 'A modern and self-hosted file upload service that can handle anything you throw at it. Fast uploads, file manager and sharing capabilities all crafted with a beautiful user experience in mind.' },
				{ vmid: 'og:image', property: 'og:image', content: 'https://listen.moe/public/images/share.jpg' },
				{ vmid: 'og:image:secure_url', property: 'og:image:secure_url', content: 'https://listen.moe/public/images/share.jpg' },
				{ vmid: 'og:site_name', property: 'og:site_name', content: 'LISTEN.moe' }
			]
		};
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
			if (localStorage && localStorage.getItem('ls-token')) return this.tryToLogin(next, `/login?redirect=${to.path}`);

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
	@import "./styles/icons.min.css";
</style>
