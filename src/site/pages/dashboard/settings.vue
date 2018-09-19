<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';
	section { background-color: $backgroundLight1 !important; }
	section.hero div.hero-body {
		align-items: baseline;
	}
	div.search-container {
		display: flex;
		justify-content: center;
	}
</style>
<style lang="scss">
	@import '~/assets/styles/_colors.scss';
</style>


<template>
	<section class="hero is-fullheight">
		<div class="hero-body">
			<div class="container">
				<div class="columns">
					<div class="column is-narrow">
						<Sidebar />
					</div>
					<div class="column">
						<!--
						<h1 class="title">Uploads</h1>
						<h2 class="subtitle">Keep track of all your uploads in here</h2>
						<hr>
						-->

						<div class="field">
							<b-switch v-model="options.removeExif"
								true-value="Remove exif data when uploading files"
								false-value="Don't remove exif data when uploading files"
								type="is-success">
								{{ options.removeExif }}
							</b-switch>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import Sidebar from '~/components/sidebar/Sidebar.vue';

export default {
	components: {
		Sidebar
	},
	data() {
		return {
			options: {
				removeExif: false
			}
		};
	},
	metaInfo() {
		return { title: 'Settings' };
	},
	mounted() {
		this.$ga.page({
			page: '/dashboard/settings',
			title: 'Settings',
			location: window.location.href
		});
	},
	methods: {

	}
};
</script>
