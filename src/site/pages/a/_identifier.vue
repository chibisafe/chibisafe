<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';
	section.hero div.hero-body.align-top {
		align-items: baseline;
		flex-grow: 0;
		padding-bottom: 0;
	}

	div.loading-container {
		justify-content: center;
		display: flex;
	}
</style>
<style lang="scss">
	@import '~/assets/styles/_colors.scss';
</style>

<template>
	<section class="hero is-fullheight">
		<template v-if="files && files.length">
			<div class="hero-body align-top">
				<div class="container">
					<h1 class="title">{{ name }}</h1>
					<h2 class="subtitle">Serving {{ files ? files.length : 0 }} files</h2>
					<a v-if="downloadLink"
						:href="downloadLink">Download Album</a>
					<hr>
				</div>
			</div>
			<div class="hero-body">
				<div class="container">
					<Grid v-if="files && files.length"
						:files="files"
						:isPublic="true"
						:width="200"
						:enableSearch="false"
						:enableToolbar="false" />
				</div>
			</div>
		</template>
		<template v-else>
			<div class="hero-body">
				<div class="container">
					<h1 class="title">:(</h1>
					<h2 class="subtitle">This album seems to be empty</h2>
				</div>
			</div>
		</template>
	</section>
</template>

<script>
import Grid from '~/components/grid/Grid.vue';
import axios from 'axios';

export default {
	components: { Grid },
	data() {
		return {};
	},
	computed: {
		config() {
			return this.$store.state.config;
		}
	},
	async asyncData({ app, params, error }) {
		try {
			const { data } = await axios.get(`${app.store.state.config.baseURL}/album/${params.identifier}`);
			const downloadLink = data.downloadEnabled ? `${app.store.state.config.baseURL}/album/${params.identifier}/zip` : null;
			return {
				name: data.name,
				downloadEnabled: data.downloadEnabled,
				files: data.files,
				downloadLink
			};
		} catch (err) {
			console.log('Error when retrieving album', err);
			error({ statusCode: 404, message: 'Album not found' });
		}
	},
	metaInfo() {
		if (this.files) {
			return {
				title: `${this.name ? this.name : ''}`,
				meta: [
					{ vmid: 'theme-color', name: 'theme-color', content: '#30a9ed' },
					{ vmid: 'twitter:card', name: 'twitter:card', content: 'summary' },
					{ vmid: 'twitter:title', name: 'twitter:title', content: `Album: ${this.name} | Files: ${this.files.length}` },
					{ vmid: 'twitter:description', name: 'twitter:description', content: 'A modern and self-hosted file upload service that can handle anything you throw at it. Fast uploads, file manager and sharing capabilities all crafted with a beautiful user experience in mind.' },
					{ vmid: 'twitter:image', name: 'twitter:image', content: `${this.files.length > 0 ? this.files[0].thumbSquare : '/public/images/share.jpg'}` },
					{ vmid: 'twitter:image:src', name: 'twitter:image:src', value: `${this.files.length > 0 ? this.files[0].thumbSquare : '/public/images/share.jpg'}` },

					{ vmid: 'og:url', property: 'og:url', content: `${this.config.URL}/a/${this.$route.params.identifier}` },
					{ vmid: 'og:title', property: 'og:title', content: `Album: ${this.name} | Files: ${this.files.length}` },
					{ vmid: 'og:description', property: 'og:description', content: 'A modern and self-hosted file upload service that can handle anything you throw at it. Fast uploads, file manager and sharing capabilities all crafted with a beautiful user experience in mind.' },
					{ vmid: 'og:image', property: 'og:image', content: `${this.files.length > 0 ? this.files[0].thumbSquare : '/public/images/share.jpg'}` },
					{ vmid: 'og:image:secure_url', property: 'og:image:secure_url', content: `${this.files.length > 0 ? this.files[0].thumbSquare : '/public/images/share.jpg'}` }
				]
			};
		}
		return {
			title: `${this.name ? this.name : ''}`,
			meta: [
				{ vmid: 'theme-color', name: 'theme-color', content: '#30a9ed' },
				{ vmid: 'twitter:card', name: 'twitter:card', content: 'summary' },
				{ vmid: 'twitter:title', name: 'twitter:title', content: 'lolisafe' },
				{ vmid: 'twitter:description', name: 'twitter:description', content: 'A modern and self-hosted file upload service that can handle anything you throw at it. Fast uploads, file manager and sharing capabilities all crafted with a beautiful user experience in mind.' },
				{ vmid: 'og:url', property: 'og:url', content: `${this.config.URL}/a/${this.$route.params.identifier}` },
				{ vmid: 'og:title', property: 'og:title', content: 'lolisafe' },
				{ vmid: 'og:description', property: 'og:description', content: 'A modern and self-hosted file upload service that can handle anything you throw at it. Fast uploads, file manager and sharing capabilities all crafted with a beautiful user experience in mind.' }
			]
		};
	}
};
</script>
