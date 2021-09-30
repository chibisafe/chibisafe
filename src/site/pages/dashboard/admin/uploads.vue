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
						Manage public uploads
					</h2>
					<hr>

					<div class="mb2 mt2 text-center">
						<b-button
							type="is-danger"
							@click="promptPurgeFiles()">
							Purge files
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
		await app.store.dispatch('admin/fetchFiles');
	},
	methods: {
		...mapActions({
			fetch: 'admin/fetchFiles'
		}),
		async fetchPaginate() {
			this.isLoading = true;
			await this.fetch( this.current );
			this.isLoading = false;
		},
		promptPurgeFiles() {
			this.$buefy.dialog.confirm({
				message: 'Are you sure you want to delete public files?',
				onConfirm: () => this.purgeFiles()
			});
		},
		async purgeFiles() {
			this.$handler.executeAction('admin/purgeUserFiles', null);
		}
	}
};
</script>
