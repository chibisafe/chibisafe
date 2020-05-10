<style lang="scss" scoped>
	.albumsModal .columns .column { padding: .25rem; }
</style>

<template>
	<section class="hero is-fullheight dashboard">
		<div class="hero-body">
			<div class="container">
				<div class="columns">
					<div class="column is-narrow">
						<Sidebar />
					</div>
					<div class="column">
						<h2 class="subtitle">Files</h2>
						<hr>
						<!-- TODO: Add a list view so the user can see the files that don't have thumbnails, like text documents -->
						<Grid v-if="files.length"
							:files="files" />
					</div>
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
			files: []
		};
	},
	metaInfo() {
		return { title: 'Album' };
	},
	async asyncData({ $axios, route }) {
		try {
			const response = await $axios.$get(`album/${route.params.id}/full`);
			return {
				files: response.files ? response.files : []
			};
		} catch (error) {
			console.error(error);
			return { files: [] };
		}
	}
};
</script>
