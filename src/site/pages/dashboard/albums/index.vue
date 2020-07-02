<template>
	<section class="hero is-fullheight dashboard">
		<div class="hero-body">
			<div class="container">
				<div class="columns">
					<div class="column is-narrow">
						<Sidebar />
					</div>
					<div class="column">
						<h2 class="subtitle">Manage your albums</h2>
						<hr>

						<div class="search-container">
							<b-field>
								<b-input v-model="newAlbumName"
									placeholder="Album name..."
									type="text"
									@keyup.enter.native="createAlbum" />
								<p class="control">
									<button outlined
										class="button is-primary"
										@click="createAlbum">Create album</button>
								</p>
							</b-field>
						</div>

						<div class="view-container">
							<AlbumEntry v-for="album in albums.list"
								:key="album.id"
								:album="album" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import { mapState } from 'vuex';
import Sidebar from '~/components/sidebar/Sidebar.vue';
import AlbumEntry from '~/components/album/AlbumEntry.vue';

export default {
	components: {
		Sidebar,
		AlbumEntry
	},
	middleware: ['auth', ({ store }) => {
		store.dispatch('albums/fetch');
	}],
	data() {
		return {
			newAlbumName: null
		};
	},
	computed: mapState(['config', 'albums']),
	metaInfo() {
		return { title: 'Uploads' };
	},
	methods: {
		async createAlbum() {
			if (!this.newAlbumName || this.newAlbumName === '') return;
			const response = await this.$axios.$post(`album/new`,
				{ name: this.newAlbumName });
			this.newAlbumName = null;
			this.$buefy.toast.open(response.message);
			this.getAlbums();
		}
	}
};
</script>

<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';
	div.view-container {
		padding: 2rem;
	}

	div.search-container {
		padding: 1rem 2rem;
		background-color: $base-2;
	}

	div.column > h2.subtitle { padding-top: 1px; }
</style>
