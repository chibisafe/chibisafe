<template>
	<section class="section is-fullheight dashboard">
		<div class="container">
			<div class="columns">
				<div class="column is-narrow">
					<Sidebar />
				</div>
				<div class="column">
					<h2 class="subtitle">
						Service settings
					</h2>
					<hr>

					<div v-for="[sectionName, fields] in Object.entries(sectionedSettings)" :key="sectionName" class="block">
						<h5 class="title is-5 has-text-grey-lighter text-center mb4 mt4">
							{{ sectionName }}
						</h5>
						<JoiObject ref="jois" :settings="fields" :errors="validationErrors" />
					</div>

					<div class="mb2 mt2 text-center">
						<button
							class="button is-primary"
							@click="promptRestartService">
							Save settings
						</button>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import { mapState } from 'vuex';
import Sidebar from '~/components/sidebar/Sidebar.vue';
import JoiObject from '~/components/settings/JoiObject.vue';

export default {
	components: {
		Sidebar,
		JoiObject
	},
	middleware: ['auth', 'admin'],
	data() {
		return {
			validationErrors: {}
		};
	},
	computed: {
		...mapState({
			settings: state => state.admin.settings,
			settingsSchema: state => state.admin.settingsSchema
		}),
		sectionedSettings() {
			return Object.entries(this.settingsSchema.keys).reduce((acc, [key, field]) => {
				if (!field.metas) acc.Other = { ...acc.Other, [key]: field };

				const sectionMeta = field.metas.find(e => e.section);
				if (sectionMeta) {
					acc[sectionMeta.section] = { ...acc[sectionMeta.section], [key]: field };
				} else {
					acc.Other = { ...acc.Other, [key]: field };
				}

				return acc;
			}, {});
		}
	},
	async asyncData({ app }) {
		await app.store.dispatch('admin/fetchSettings');
		await app.store.dispatch('admin/getSettingsSchema');
		await app.store.commit('admin/populateSchemaWithValues');
	},
	methods: {
		promptRestartService() {
			this.$buefy.dialog.confirm({
				message: 'Certain changes need for you to manually restart your chibisafe instance, please do so from the terminal. Continue?',
				onConfirm: () => this.saveSettings()
			});
		},
		async saveSettings() {
			// handle refs
			let settings = {};
			for (const joiComponent of this.$refs.jois) {
				settings = { ...settings, ...joiComponent.getValues() };
			}

			try {
				await this.$store.dispatch('admin/saveSettings', settings);
				this.$set(this, 'validationErrors', {});

				await this.$store.dispatch('config/fetchSettings');
				// this.$handler.executeAction('admin/restartService');
			} catch (e) {
				if (e.response?.data?.errors) {
					this.$set(this, 'validationErrors', e.response.data.errors);
				}
			}
		}
	},
	head() {
		return {
			title: 'Service settings'
		};
	}
};
</script>
<style lang="scss" scoped>
h5.title {
	text-decoration: underline;
}
</style>
