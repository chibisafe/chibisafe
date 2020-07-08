<template>
	<div
		v-bar
		class="scroll-area">
		<div class="default-body">
			<Navbar :isWhite="true" />
			<nuxt-child
				id="app"
				class="nuxt-app is-height-max-content" />
			<Footer />
		</div>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import Navbar from '~/components/navbar/Navbar.vue';
import Footer from '~/components/footer/Footer.vue';

export default {
	components: {
		Navbar,
		Footer,
	},
	computed: mapState(['config']),
	created() {
		this.$store.watch((state) => state.alert.text, () => {
			const { text, error } = this.$store.state.alert;

			if (!text) return;

			this.$buefy.toast.open({
				duration: 3500,
				message: text,
				position: 'is-bottom',
				type: error ? 'is-danger' : 'is-success',
			});

			this.$store.dispatch('alert/clear', null);
		});
	},
	mounted() {
		// eslint-disable-next-line no-console
		console.log(
			`%c lolisafe %c v${this.config.version} %c`,
			'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
			'background:#ff015b; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
			'background:transparent',
		);
	},
};
</script>

<style lang="scss">
html {
	overflow: hidden !important;
}
.is-fullheight {
	min-height: 100vh !important;
	height: max-content;
}
.nuxt-app > .section {
	min-height: auto !important;
	height: auto !important;
}
@import '~/assets/styles/style.scss';
@import '~/assets/styles/icons.min.css';
</style>
<style lang="scss" scoped>
.default-body {
	align-items: baseline !important;
}
.scroll-area {
	height: 100vh;
}
</style>
