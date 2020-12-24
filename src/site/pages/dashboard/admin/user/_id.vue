<style lang="scss" scoped>
	.underline { text-decoration: underline; }
</style>
<template>
	<section class="section is-fullheight dashboard">
		<div class="container">
			<div class="columns">
				<div class="column is-narrow">
					<Sidebar />
				</div>
				<div class="column">
					<h2 class="subtitle">
						User details
					</h2>
					<hr>

					<b-field
						label="User Id"
						horizontal>
						<span>{{ user.id }}</span>
					</b-field>

					<b-field
						label="Username"
						horizontal>
						<span>{{ user.username }}</span>
					</b-field>

					<b-field
						label="Enabled"
						horizontal>
						<span>{{ user.enabled }}</span>
					</b-field>

					<b-field
						label="Registered"
						horizontal>
						<span><timeago :since="user.createdAt" /></span>
					</b-field>

					<b-field
						label="Files"
						horizontal>
						<span>{{ user.files.length }}</span>
					</b-field>

					<div class="mb2 mt2 text-center">
						<b-button
							v-if="user.enabled"
							type="is-danger"
							@click="promptDisableUser">
							Disable user
						</b-button>
						<b-button
							v-if="!user.enabled"
							type="is-success"
							@click="promptEnableUser">
							Enable user
						</b-button>
					</div>

					<Grid
						v-if="user.files.length"
						:files="user.files" />
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import { mapState } from 'vuex';
import Sidebar from '~/components/sidebar/Sidebar.vue';
import Grid from '~/components/grid/Grid.vue';

export default {
	components: {
		Sidebar,
		Grid
	},
	middleware: ['auth', 'admin', ({ route, store }) => {
		try {
			store.dispatch('admin/fetchUser', route.params.id);
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e);
		}
	}],
	data() {
		return {
			options: {}
		};
	},
	computed: mapState({
		user: (state) => state.admin.user
	}),
	methods: {
		promptDisableUser() {
			this.$buefy.dialog.confirm({
				type: 'is-danger',
				message: 'Are you sure you want to disable the account of this user?',
				onConfirm: () => this.disableUser()
			});
		},
		promptEnableUser() {
			this.$buefy.dialog.confirm({
				type: 'is-danger',
				message: 'Are you sure you want to enable the account of this user?',
				onConfirm: () => this.enableUser()
			});
		},
		disableUser() {
			this.$handler.executeAction('admin/disableUser', this.user.id);
		},
		enableUser() {
			this.$handler.executeAction('admin/enableUser', this.user.id);
		}
	}
};
</script>
