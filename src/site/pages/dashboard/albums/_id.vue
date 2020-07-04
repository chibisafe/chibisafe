<style lang="scss" scoped>
	.albumsModal .columns .column { padding: .25rem; }
</style>

<template>
	<section class="section is-fullheight dashboard">
		<div class="container">
			<div class="columns">
				<div class="column is-narrow">
					<Sidebar />
				</div>
				<div class="column">
					<nav class="level">
						<div class="level-left">
							<div class="level-item">
								<h2 class="subtitle">Files</h2>
							</div>
						</div>
						<div class="level-right">
							<div class="level-item">
								<b-field>
									<b-input
										placeholder="Search"
										type="search"/>
									<p class="control">
										<button
											outlined
											class="button is-primary">
											Search
										</button>
									</p>
								</b-field>
							</div>
						</div>
					</nav>

					<hr>

					<Grid v-if="files.length"
						:files="files"
						:total="count">
						<template v-slot:pagination>
							<b-pagination
								v-if="count > perPage"
								:total="count"
								:per-page="perPage"
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
import Sidebar from '~/components/sidebar/Sidebar.vue';
import Grid from '~/components/grid/Grid.vue';

export default {
	components: {
		Sidebar,
		Grid
	},
	middleware: 'auth',
	data() {
		return {
			name: null,
			files: [],
			count: 0,
			current: 1,
			perPage: 30
		};
	},
	metaInfo() {
		return { title: 'Album' };
	},
	watch: {
		current: 'getFiles'
	},
	async asyncData({ $axios, route }) {
		const perPage = 30;
		const current = 1; // current page

		try {
			const response = await $axios.$get(`album/${route.params.id}/full`, { params: { page: current, limit: perPage }});
			return {
				files: response.files || [],
				count: response.count || 0,
				current,
				perPage
			};
		} catch (error) {
			console.error(error);
			return { files: [] };
		}
	},
	methods: {
		async getFiles() {
			const response = await this.$axios.$get(`album/${this.$route.params.id}/full`, { params: { page: this.current, limit: this.perPage }});
			this.files = response.files;
			this.count = response.count;
		}
	},
};
</script>
