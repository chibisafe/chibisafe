<template>
	<section class="section is-fullheight dashboard">
		<div class="container">
			<div class="columns ">
				<div class="column is-narrow">
					<Sidebar />
				</div>
				<div class="column">
					<nav class="level">
						<div class="level-left">
							<div class="level-item">
								<h2 class="subtitle">
									Your uploaded files
								</h2>
							</div>
						</div>
						<div class="level-right">
							<div class="level-item">
								<b-field>
									<b-input
										class="lolisafe-input"
										placeholder="Search"
										type="search" />
									<p class="control">
										<b-button type="is-lolisafe">
											Search
										</b-button>
									</p>
								</b-field>
							</div>
						</div>
					</nav>
					<hr>

					<!-- <b-loading :active="images.isLoading" /> -->

					<Grid
						v-if="totalFiles && !isLoading"
						:files="images.files"
						:enableSearch="false"
						class="grid">
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

export default {
	components: {
		Sidebar,
		Grid,
	},
	middleware: ['auth', ({ store }) => {
		store.commit('images/resetState');
		store.dispatch('images/fetch');
	}],
	data() {
		return {
			current: 1,
			isLoading: false,
		};
	},
	computed: {
		...mapGetters({
			totalFiles: 'images/getTotalFiles',
			shouldPaginate: 'images/shouldPaginate',
			limit: 'images/getLimit',
		}),
		...mapState(['images']),
	},
	metaInfo() {
		return { title: 'Uploads' };
	},
	watch: {
		current: 'fetchPaginate',
	},
	methods: {
		...mapActions({
			fetch: 'images/fetch',
		}),
		async fetchPaginate() {
			this.isLoading = true;
			await this.fetch(this.current);
			this.isLoading = false;
		},
	},
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
</style>
