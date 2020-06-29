<template>
	<div v-bar
		class="scroll-area">
		<div class="default-body">
			<Navbar :isWhite="true" />
			<nuxt-child id="app"
				class="nuxt-app is-height-max-content" />
			<Footer />
		</div>
	</div>
</template>
<script>
import Navbar from '~/components/navbar/Navbar.vue';
import Footer from '~/components/footer/Footer';
export default {
	components: { 
		Navbar, 
		Footer
	},
	computed: {
		config() {
			return this.$store.state.config;
		},
		alert() {
			return this.$store.state.alert;
		}
	},
	watch: {
		alert() {
			if (!this.alert) return;

			this.$buefy.toast.open({
				duration: 3500,
				message: this.alert.text,
				position: 'is-bottom',
				type: this.alert.error ? 'is-danger' : 'is-success'
			});

			setTimeout(() => {
				this.$store.dispatch('alert', null);
			}, 3500);
		}
	},
	mounted() {
		console.log(`%c lolisafe %c v${this.config.version} %c`, 'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#ff015b; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:transparent');
	}
};
</script>
<style lang="scss">
	html { overflow: hidden !important; }
	.is-fullheight { height: 100vh !important; }
	.nuxt-app > .section {
		min-height: auto !important;
		height: auto !important;
	}
	@import "~/assets/styles/style.scss";
	@import "~/assets/styles/icons.min.css";
</style>
<style lang="scss" scoped>
	.default-body {
		align-items: baseline !important;
	}
	.scroll-area {
		height: 100vh;
	}
</style>
