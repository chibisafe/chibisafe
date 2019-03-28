<template>
	<nuxt />
</template>
<script>
import Vue from 'vue';
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
		Vue.prototype.$onPromiseError = (error, logout = false) => {
			this.processCatch(error, logout);
		};

		Vue.prototype.$showToast = (text, error, duration) => {
			this.showToast(text, error, duration);
		};
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
				/*
				if (error.response.status === 429) return;
				if (error.response.status === 502) return;
				if (error.response.data.message === 'Token expired') {
					this.$logOut();
					setTimeout(() => this.$router.push('/'), 3000);
				}
				*/
			} else {
				console.error(error);
				this.showToast('Something went wrong, please check the console :(', true, 5000);
			}
		}
	}
};
</script>
<style lang="scss">
	@import "~/assets/styles/style.scss";
	@import "~assets/styles/icons.min.css";
</style>
