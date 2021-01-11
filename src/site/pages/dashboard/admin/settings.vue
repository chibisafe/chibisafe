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

					<!-- TODO: IMPLEMENT SECTIONS (v-for JoiObject for each section maybe?) -->
					<JoiObject :keys="sectionedSettings" :values="{}" />
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
			return Object.entries(this.settings).reduce((acc, { key, field }) => {
				if (!field.meta) acc['Other'] = { ...acc['Other'], [key]: field };

				const { sectionName } = field.metas.find(e => e.sectionName);
				if (sectionName) {
					acc[sectionName] = { ...acc[sectionName], [key]: field };
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
