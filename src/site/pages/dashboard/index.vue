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
					<!-- TODO: Add a list view so the user can see the files that don't have thumbnails, like text documents -->
					<Grid v-if="files.length"
						:files="paginatedFiles"
						:enableSearch="false"
						class="grid" />

					<b-pagination
						v-if="files.length > perPage"
						:total="files.length"
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
			current: 1,
			perPage: 20
		};
	},
	computed: {
		paginatedFiles() {
			return this.files.slice((this.current - 1) * this.perPage, this.current * this.perPage);
		}
	},
	metaInfo() {
		return { title: 'Uploads' };
	},
	mounted() {
		this.getFiles();
	},
	methods: {
		async getFiles() {
			const response = await this.$axios.$get(`files`);
			this.files = response.files;
		}
	}
};
</script>

<style lang="scss" scoped>
	div.grid {
		margin-bottom: 1rem;
	}
</style>