<style lang="scss" scoped>
	@import '../../styles/colors.scss';
	section { background-color: $backgroundLight1 !important; }
	section.hero div.hero-body {
		align-items: baseline;
	}
</style>
<style lang="scss">
	@import '../../styles/colors.scss';
</style>


<template>
	<section class="hero is-fullheight">
		<div class="hero-body">
			<div class="container">
				<div class="columns">
					<div class="column is-narrow">
						<Sidebar/>
					</div>
					<div class="column">
						<!--
						<h1 class="title">Uploads</h1>
						<h2 class="subtitle">Keep track of all your uploads in here</h2>
						<hr>
						-->
						<Grid v-if="files.length"
							:files="files"/>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import Sidebar from '../../components/sidebar/Sidebar.vue';
import Grid from '../../components/grid/Grid.vue';

export default {
	components: {
		Sidebar,
		Grid
	},
	data() {
		return { files: [] };
	},
	metaInfo() {
		return { title: 'Uploads' };
	},
	mounted() {
		this.getFiles();
		this.$ga.page({
			page: '/dashboard',
			title: 'Dashboard',
			location: window.location.href
		});
	},
	methods: {
		async getFiles() {
			try {
				const response = await this.axios.get(`${this.$config.baseURL}/files`);
				this.files = response.data.files;
				console.log(this.files);
			} catch (error) {
				console.error(error);
			}
		}
	}
};
</script>
