<template>
	<section class="hero is-fullheight dashboard">
		<div class="hero-body">
			<div class="container">
				<div class="columns">
					<div class="column is-narrow">
						<Sidebar />
					</div>
					<div class="column">
						<h2 class="subtitle">Your uploaded files</h2>
						<hr>
						<!-- TODO: Add a list view so the user can see the files that don't have thumbnails, like text documents -->
						<Grid v-if="files.length"
							:files="files"
							:enableSearch="false" />
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
			files: []
		};
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
