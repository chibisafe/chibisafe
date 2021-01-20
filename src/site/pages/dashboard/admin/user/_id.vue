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
						:files="user.files">
						<template v-slot:pagination>
							<b-pagination
								:total="user.totalFiles"
								:per-page="limit"
								:current.sync="current"
								range-before="2"
								range-after="2"
								class="pagination-slot"
								icon-prev="icon-interface-arrow-left"
								icon-next="icon-interface-arrow-right"
								icon-pack="icon"
								aria-next-label="Next page"
								aria-previous-label="Previous page"
								aria-page-label="Page"
								aria-current-label="Current page" />
						</template>
					</Grid>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import Sidebar from '~/components/sidebar/Sidebar.vue';
import Grid from '~/components/grid/Grid.vue';

export default {
	components: {
		Sidebar,
		Grid
	},
	middleware: ['auth', 'admin'],
	data() {
		return {
			options: {},
			current: 1,
			isLoading: false
		};
	},
	computed: {
		...mapGetters({
			limit: 'images/getLimit'
		}),
		...mapState({
			user: state => state.admin.user
		})
	},
	watch: {
		current: 'fetchPaginate'
	},
	async asyncData({ app, params }) {
		await app.store.dispatch('admin/fetchUser', { id: params.id });
	},
	methods: {
		...mapActions({
			fetch: 'admin/fetchUser'
		}),
		async fetchPaginate() {
			this.isLoading = true;
			await this.fetch({ id: this.$route.params.id, page: this.current });
			this.isLoading = false;
		},
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
