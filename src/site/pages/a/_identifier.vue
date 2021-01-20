<template>
	<section class="section is-fullheight">
		<template v-if="files && files.length">
			<div class="align-top">
				<div class="container">
					<h1 class="title">
						{{ name }}
					</h1>
					<h2 class="subtitle">
						Serving {{ totalFiles }} files
					</h2>
					<a
						v-if="downloadLink"
						:href="downloadLink">Download Album</a>
					<hr>
				</div>
			</div>
			<div class="container">
				<template v-if="!isNsfw || (isNsfw && nsfwConsent)">
					<Grid
						v-if="files && files.length"
						:files="files"
						:is-public="true"
						:width="200"
						:enable-search="false"
						:enable-toolbar="false">
						<template v-slot:pagination>
							<b-pagination
								:total="totalFiles"
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
				</template>
				<template v-else>
					<div class="nsfw">
						<i class="mdi mdi-alert mdi-48px" />
						<h1>NSFW Content</h1>
						<p>
							This album contains images or videos that are not safe for work or are inappropriate to view in some situations.<br>
							Do you wish to proceed?
						</p>
						<button
							class="button is-danger"
							@click="nsfwConsent = true">
							Show me the content
						</button>
					</div>
				</template>
			</div>
		</template>
		<template v-else>
			<div class="container">
				<h1 class="title">
					:(
				</h1>
				<h2 class="subtitle">
					This album seems to be empty
				</h2>
			</div>
		</template>
	</section>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import Grid from '~/components/grid/Grid.vue';
import logo from '~/assets/images/logo.png';
export default {
	components: { Grid },
	data() {
		return {
			nsfwConsent: false,
			current: 1,
			name: null,
			downloadEnabled: false,
			files: [],
			downloadLink: null,
			isNsfw: false,
			totalFiles: 0
		};
	},
	computed: {
		...mapGetters({
			limit: 'images/getLimit'
		}),
		config() {
			return this.$store.state.config;
		}
	},
	watch: {
		current: 'fetchPaginate'
	},
	async asyncData({ app, params, error }) {
		try {
			const { data } = await axios.get(`${app.store.state.config.baseURL}/album/${params.identifier}`, { params: { limit: 50, page: 1 } });
			const downloadLink = data.downloadEnabled ? `${app.store.state.config.baseURL}/album/${params.identifier}/zip` : null;
			return {
				name: data.name,
				downloadEnabled: data.downloadEnabled,
				files: data.files,
				downloadLink,
				isNsfw: data.isNsfw,
				totalFiles: data.count
			};
		} catch (err) {
			console.log('Error when retrieving album', err);
			error({ statusCode: 404, message: 'Album not found' });
		}
	},
	methods: {
		async fetch(page = 1) {
			try {
				const { data } = await axios.get(
					`${this.$store.state.config.baseURL}/album/${this.$route.params.identifier}`,
					{ params: { limit: 50, page } }
				);
				const downloadLink = data.downloadEnabled ? `${this.$store.state.config.baseURL}/album/${this.$route.params.identifier}/zip` : null;

				this.name = data.name;
				this.downloadEnabled = data.downloadEnabled;
				this.files = data.files;
				this.downloadLink = downloadLink;
				this.isNsfw = data.isNsfw;
				this.totalFiles = data.count;
			} catch (err) {
				this.$notifier.error(err.message);
			}
		},
		async fetchPaginate() {
			this.isLoading = true;
			await this.fetch(this.current);
			this.isLoading = false;
		}
	},
	head() {
		if (this.files) {
			const image = this.isNsfw ? logo : this.files.length ? this.files[0].url : logo;
			const title = this.name ? this.isNsfw ? `[NSFW] ${this.name}` : this.name : '';
			const description = `Files: ${this.totalFiles}`;
			return {
				title,
				meta: [
					{ hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
					{ hid: 'twitter:title', name: 'twitter:title', content: title },
					{ hid: 'twitter:image', name: 'twitter:image', content: image },
					{ hid: 'twitter:label1', name: 'twitter:label1', value: 'Files' },
					{ hid: 'twitter:data1', name: 'twitter:data1', value: this.totalFiles },
					{ hid: 'twitter:description', name: 'twitter:description', content: description },
					{ hid: 'og:description', property: 'og:description', content: description },
					{ hid: 'og:url', property: 'og:url', content: `${this.config.URL}/a/${this.$route.params.identifier}` },
					{ hid: 'og:title', property: 'og:title', content: title },
					{ hid: 'og:image', property: 'og:image', content: image },
					{ hid: 'og:image:secure_url', property: 'og:image:secure_url', content: image }
				]
			};
		}
		return {
			title: `${this.name ? this.name : ''}`,
			meta: [
				{ hid: 'og:url', property: 'og:url', content: `${this.config.URL}/a/${this.$route.params.identifier}` }
			]
		};
	}
};
</script>
<style lang="scss" scoped>
	section.hero div.hero-body.align-top {
		align-items: baseline;
		flex-grow: 0;
		padding-bottom: 0;
	}

	div.loading-container {
		justify-content: center;
		display: flex;
	}
	.nsfw {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 50vh;

		h1 {
			font-size: 2rem;
			margin-bottom: 2rem;
		}
		p {
			font-size: 1.5rem;
			margin-bottom: 2rem;
			text-align: center;
		}
	}
</style>
<style lang="scss">
	.pagination-slot > .pagination-previous, .pagination-slot > .pagination-next {
		display: none !important;
	}
</style>
