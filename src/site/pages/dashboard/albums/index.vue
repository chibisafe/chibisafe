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
										class="button is-black"
										:disabled="isCreatingAlbum"
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
import { mapState, mapActions } from 'vuex';
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
			newAlbumName: null,
			isCreatingAlbum: false
		};
	},
	computed: mapState(['config', 'albums']),
	metaInfo() {
		return { title: 'Uploads' };
	},
	methods: {
		...mapActions({
			'alert': 'alert/set'
		}),
		async createAlbum() {
			if (!this.newAlbumName || this.newAlbumName === '') return;

			this.isCreatingAlbum = true;
			try {
				const response = await this.$store.dispatch('albums/createAlbum', this.newAlbumName);

				this.alert({ text: response.message, error: false });
			} catch (e) {
				this.alert({ text: e.message, error: true });
			} finally {
				this.isCreatingAlbum = false;
				this.newAlbumName = null;
			}
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
