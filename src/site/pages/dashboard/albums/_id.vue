<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';
	section { background-color: $backgroundLight1 !important; }
	section.hero div.hero-body {
		align-items: baseline;
	}

	.albumsModal .columns .column { padding: .25rem; }
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
						<h2 class="subtitle">Files</h2>
						<hr>
						<!-- TODO: Add a list view so the user can see the files that don't have thumbnails, like text documents -->
						<Grid v-if="files.length"
							:files="files" />
					</div>
				</div>
			</div>
		</div>

		<b-modal :active.sync="isAlbumsModalActive"
			:width="640"
			scroll="keep">
			<div class="card albumsModal">
				<div class="card-content">
					<div class="content">
						<h3 class="subtitle">Select the albums this file should be a part of</h3>
						<hr>
						<div class="columns is-multiline">
							<div v-for="(album, index) in albums"
								:key="index"
								class="column is-3">
								<div class="field">
									<b-checkbox :value="isAlbumSelected(album.id)"
										@input="albumCheckboxClicked($event, album.id)">{{ album.name }}</b-checkbox>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</b-modal>
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
	data() {
		return {
			name: null,
			files: [],
			albums: [],
			isAlbumsModalActive: false,
			showingModalForFile: null
		};
	},
	computed: {
		config() {
			return this.$store.state.config;
		}
	},
	metaInfo() {
		return { title: 'Album' };
	},
	mounted() {
		this.getFiles();
		this.getAlbums();
	},
	methods: {
		isAlbumSelected(id) {
			if (!this.showingModalForFile) return;
			const found = this.showingModalForFile.albums.find(el => el.id === id);
			return found ? found.id ? true : false : false;
		},
		openAlbumModal(file) {
			this.showingModalForFile = file;
			this.isAlbumsModalActive = true;
		},
		async albumCheckboxClicked(value, id) {
			try {
				const response = await this.axios.post(`${this.config.baseURL}/file/album/${value ? 'add' : 'del'}`, {
					albumId: id,
					fileId: this.showingModalForFile.id
				});
				this.$toast.open(response.data.message);
				this.getFiles();
			} catch (error) {
				this.$onPromiseError(error);
			}
		},
		async getFiles() {
			// TODO: Make this think SSR with AsyncData
			try {
				const response = await this.axios.get(`${this.config.baseURL}/album/${this.$route.params.id}/full`);
				this.files = response.data.files;
			} catch (error) {
				console.error(error);
			}
		},
		async getAlbums() {
			try {
				const response = await this.axios.get(`${this.config.baseURL}/albums/dropdown`);
				this.albums = response.data.albums;
			} catch (error) {
				this.$onPromiseError(error);
			}
		}
	}
};
</script>
