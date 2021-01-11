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
						<h5 class="title is-5 has-text-grey-lighter">
							{{ sectionName }}
						</h5>
						<JoiObject :keys="fields" :values="{}" />
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
	middleware: ['auth', 'admin', ({ store }) => {
		try {
			store.dispatch('admin/fetchSettings');
			// TODO: Implement merging fields with values from the db (no endpoint to fetch settings yet)
			store.dispatch('admin/getSettingsSchema');
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e);
		}
	}],
	computed: {
		...mapState({
			settings: state => state.admin.settings,
			settingsSchema: state => state.admin.settingsSchema
		}),
		sectionedSettings() {
			return Object.entries(this.settingsSchema.keys).reduce((acc, [key, field]) => {
				if (!field.metas) acc['Other'] = { ...acc['Other'], [key]: field };

				const sectionMeta = field.metas.find(e => e.section);
				if (sectionMeta) {
					acc[sectionMeta.section] = { ...acc[sectionMeta.section], [key]: field };
				} else {
					acc['Other'] = { ...acc['Other'], [key]: field };
				}

				return acc;
			}, {});
		}
	},
	methods: {
		promptRestartService() {
			this.$buefy.dialog.confirm({
				message: 'Keep in mind that restarting only works if you have PM2 or something similar set up. Continue?',
				onConfirm: () => this.restartService()
			});
		},
		restartService() {
			this.$handler.executeAction('admin/restartService');
		}
	},
	head() {
		return {
			title: 'Service settings'
		};
	}
};
</script>
