<template>
	<div v-bar>
		<div>
			<div class="layout">
				<!--<Uploader />-->
				<nuxt-child id="app" />
			</div>
		</div>
	</div>
</template>
<script>
import Uploader from '~/components/uploader/Filepond.vue';
export default {
	components: { Uploader },
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
	.layout { height: 100vh; }
	@import "~/assets/styles/style.scss";
	@import "~/assets/styles/icons.min.css";
</style>
