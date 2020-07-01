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
					<h2 class="subtitle">Files</h2>
					<hr>

					<Grid v-if="files.length"
						:files="files" />

					<b-pagination
						v-if="count > perPage"
						:total="count"
						:per-page="perPage"
						:current.sync="current"
						class="pagination"
						icon-prev="icon-interface-arrow-left"
						icon-next="icon-interface-arrow-right"
						icon-pack="icon"
						aria-next-label="Next page"
						aria-previous-label="Previous page"
						aria-page-label="Page"
						aria-current-label="Current page" />
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
