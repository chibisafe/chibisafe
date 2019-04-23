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
			if (error.response && error.response.data && error.response.data.message) {
				this.$showToast(error.response.data.message, true, 5000);
			} else {
				console.error(error);
				this.$showToast('Something went wrong, please check the console :(', true, 5000);
			}
		};

		Vue.prototype.$showToast = (text, error, duration) => {
			this.$toast.open({
				duration: duration || 2500,
				message: text,
				position: 'is-bottom',
				type: error ? 'is-danger' : 'is-success'
			});
		};
	}
};
</script>
<style lang="scss">
	@import "~/assets/styles/style.scss";
	@import "~/assets/styles/icons.min.css";
</style>
