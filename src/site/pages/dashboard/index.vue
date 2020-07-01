<template>
	<section class="section is-fullheight dashboard">
		<div class="container">
			<div class="columns is-variable is-0-mobile">
				<div class="column is-narrow">
					<Sidebar />
				</div>
				<div class="column">
					<h2 class="subtitle">Your uploaded files</h2>
					<hr>

					<Grid v-if="count"
						:files="files"
						:enableSearch="false"
						class="grid" />

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
			files: [],
			count: 0,
			current: 1,
			perPage: 30
		};
	},
	metaInfo() {
		return { title: 'Uploads' };
	},
	watch: {
		current: 'getFiles'
	},
	async asyncData({ $axios, route }) {
		const perPage = 30;
		const current = 1; // current page

		try {
			const response = await $axios.$get(`files`, { params: { page: current, limit: perPage }});
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
			// TODO: Cache a few pages once fetched
			const response = await this.$axios.$get(`files`, { params: { page: this.current, limit: this.perPage }});
			this.files = response.files;
			this.count = response.count;
		}
	}
};
</script>

<style lang="scss" scoped>
	div.grid {
		margin-bottom: 1rem;
	}
</style>