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
								<h1 class="title is-3">
									{{ images.albumName }}
								</h1>
							</div>
							<div class="level-item">
								<h2 class="subtitle is-5">
									({{ totalFiles }} files)<span v-if="search.length" class="asterisk is-size-6">*</span>
								</h2>
							</div>
						</div>
						<div class="level-right">
							<div class="level-item">
								<Search @search="onSearch" />
							</div>
						</div>
					</nav>

					<hr>

					<Grid
						v-if="
							totalFiles"
						:files="images.files"
						:total="totalFiles">
						<template v-slot:pagination>
							<b-pagination
								v-if="shouldPaginate"
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
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

import Sidebar from '~/components/sidebar/Sidebar.vue';
import Grid from '~/components/grid/Grid.vue';
import Search from '~/components/search/Search.vue';

export default {
	components: {
		Sidebar,
		Grid,
		Search
	},
	middleware: ['auth', ({ route, store }) => {
		store.commit('images/resetState');
	}],
	data() {
		return {
			current: 1,
			search: ''
		};
	},
	computed: {
		...mapGetters({
			totalFiles: 'images/getTotalFiles',
			shouldPaginate: 'images/shouldPaginate',
			limit: 'images/getLimit'
		}),
		...mapState(['images']),
		id() {
			return this.$route.params.id;
		}
	},
	metaInfo() {
		return { title: 'Album' };
	},
	watch: {
		current: 'fetchPaginate'
	},
	async asyncData({ app, params }) {
		await app.store.dispatch('images/fetchByAlbumId', { id: params.id });
	},
	methods: {
		...mapActions({
			fetch: 'images/fetchByAlbumId'
		}),
		fetchPaginate() {
			// eslint-disable-next-line no-negated-condition
			if (!this.search.length) {
				this.fetch({ id: this.id, page: this.current });
			} else {
				this.$handler.executeAction('images/search', {
					q: this.search,
					page: this.current,
					albumId: this.id
				});
			}
		},
		sanitizeQuery(qry) {
			// remove spaces between a search type selector `album:`
			// and the value (ex `tag: 123` -> `tag:123`)
			return (qry || '').replace(/(\w+):\s+/gi, '$1:');
		},
		async onSearch(query) {
			this.search = this.sanitizeQuery(query);

			// eslint-disable-next-line no-negated-condition
			if (!this.search.length) {
				this.current = 1;
				await this.fetch({ id: this.id, page: this.current });
			} else {
				this.$handler.executeAction('images/search', {
					q: this.search,
					page: this.current,
					albumId: this.id
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
	div.grid {
		margin-bottom: 1rem;
	}

	.pagination-slot {
		padding: 1rem 0;
	}
</style>

<style lang="scss">
	.pagination-slot > .pagination-previous, .pagination-slot > .pagination-next {
		display: none !important;
	}
	.asterisk {
		vertical-align: text-top;
		color: red;
	}
</style>
