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
									<button class="button is-primary"
										@click="createAlbum">Create album</button>
								</p>
							</b-field>
						</div>

						<div class="view-container">
							<div v-for="album in albums"
								:key="album.id"
								class="album">
								<div class="arrow-container"
									@click="fetchAlbumDetails(album)">
									<i :class="{ active: album.isDetailsOpen }"
										class="icon-arrow" />
								</div>
								<div class="thumb">
									<figure class="image is-64x64 thumb">
										<img src="~/assets/images/blank.png">
									</figure>
								</div>
								<div class="info">
									<h4>
										<router-link :to="`/dashboard/albums/${album.id}`">{{ album.name }}</router-link>
									</h4>
									<span>Updated <timeago :since="album.editedAt" /></span>
									<span>{{ album.fileCount || 0 }} files</span>
								</div>
								<div class="latest is-hidden-mobile">
									<template v-if="album.fileCount > 0">
										<div v-for="file of album.files"
											:key="file.id"
											class="thumb">
											<figure class="image is-64x64">
												<a :href="file.url"
													target="_blank">
													<img :src="file.thumbSquare">
												</a>
											</figure>
										</div>
										<div v-if="album.fileCount > 5"
											class="thumb more no-background">
											<router-link :to="`/dashboard/albums/${album.id}`">{{ album.fileCount - 5 }}+ more</router-link>
										</div>
									</template>
									<template v-else>
										<span class="no-files">Nothing to show here</span>
									</template>
								</div>

								<div v-if="album.isDetailsOpen"
									class="details">
									<h2>Public links for this album:</h2>

									<b-table
										:data="album.links.length ? album.links : []"
										:mobile-cards="true">
										<template slot-scope="props">
											<b-table-column field="identifier"
												label="Link"
												centered>
												<a :href="`${config.URL}/a/${props.row.identifier}`"
													target="_blank">
													{{ props.row.identifier }}
												</a>
											</b-table-column>

											<b-table-column field="views"
												label="Views"
												centered>
												{{ props.row.views }}
											</b-table-column>

											<b-table-column field="enableDownload"
												label="Allow download"
												centered>
												<b-switch v-model="props.row.enableDownload"
													@input="linkOptionsChanged(props.row)" />
											</b-table-column>

											<b-table-column field="enabled"
												label="Actions"
												centered>
												<button class="button is-danger"
													@click="promptDeleteAlbumLink(props.row.identifier)">Delete link</button>
											</b-table-column>
										</template>
										<template slot="empty">
											<div class="has-text-centered">
												<i class="icon-misc-mood-sad" />
											</div>
											<div class="has-text-centered">
												Nothing here
											</div>
										</template>
										<template slot="footer">
											<div class="wrapper">
												<div class="has-text-right">
													<button :class="{ 'is-loading': album.isCreatingLink }"
														class="button is-primary"
														style="float: left"
														@click="createLink(album)">Create new link</button>
													{{ album.links.length }} / {{ config.maxLinksPerAlbum }} links created
												</div>

												<div class="has-text-left">
													<button class="button is-danger"
														style="float: right"
														@click="promptDeleteAlbum(album.id)">Delete album</button>
												</div>
											</div>
										</template>
									</b-table>
								</div>
							</div>
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
	middleware: 'auth',
	data() {
		return {
			albums: [],
			newAlbumName: null
		};
	},
	computed: {
		config() {
			return this.$store.state.config;
		}
	},
	metaInfo() {
		return { title: 'Uploads' };
	},
	mounted() {
		this.getAlbums();
	},
	methods: {
		async fetchAlbumDetails(album) {
			const response = await this.$axios.$get(`album/${album.id}/links`);
			album.links = response.links;
			album.isDetailsOpen = !album.isDetailsOpen;
			this.$forceUpdate();
		},
		promptDeleteAlbum(id) {
			this.$buefy.dialog.confirm({
				message: 'Are you sure you want to delete this album?',
				onConfirm: () => this.deleteAlbum(id)
			});
		},
		async deleteAlbum(id) {
			const response = await this.$axios.$delete(`album/${id}`);
			this.getAlbums();
			return this.$buefy.toast.open(response.message);
		},
		promptDeleteAlbumLink(identifier) {
			this.$buefy.dialog.confirm({
				message: 'Are you sure you want to delete this album link?',
				onConfirm: () => this.deleteAlbumLink(identifier)
			});
		},
		async deleteAlbumLink(identifier) {
			const response = await this.$axios.$delete(`album/link/delete/${identifier}`);
			return this.$buefy.toast.open(response.message);
		},
		async linkOptionsChanged(link) {
			const response = await this.$axios.$post(`album/link/edit`,
				{
					identifier: link.identifier,
					enableDownload: link.enableDownload,
					enabled: link.enabled
				});
			this.$buefy.toast.open(response.message);
		},
		async createLink(album) {
			album.isCreatingLink = true;
			// Since we actually want to change the state even if the call fails, use a try catch
			try {
				const response = await this.$axios.$post(`album/link/new`,
					{ albumId: album.id });
				this.$buefy.toast.open(response.message);
				album.links.push({
					identifier: response.identifier,
					views: 0,
					enabled: true,
					enableDownload: true,
					expiresAt: null
				});
			} catch (error) {
				//
			} finally {
				album.isCreatingLink = false;
			}
		},
		async createAlbum() {
			if (!this.newAlbumName || this.newAlbumName === '') return;
			const response = await this.$axios.$post(`album/new`,
				{ name: this.newAlbumName });
			this.newAlbumName = null;
			this.$buefy.toast.open(response.message);
			this.getAlbums();
		},
		async getAlbums() {
			const response = await this.$axios.$get(`albums/mini`);
			for (const album of response.albums) {
				album.isDetailsOpen = false;
			}
			this.albums = response.albums;
		}
	}
};
</script>
<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';
	div.view-container {
		padding: 2rem;
	}
	div.album {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 10px;

		div.arrow-container {
			width: 2em;
			height: 64px;
			position: relative;
			cursor: pointer;

			i {
				border: 2px solid $defaultTextColor;
				border-right: 0;
				border-top: 0;
				display: block;
				height: 1em;
				position: absolute;
				transform: rotate(-135deg);
				transform-origin: center;
				width: 1em;
				z-index: 4;
				top: 22px;

				-webkit-transition: transform 0.1s linear;
				-moz-transition: transform 0.1s linear;
				-ms-transition: transform 0.1s linear;
				-o-transition: transform 0.1s linear;
				transition: transform 0.1s linear;

				&.active {
					transform: rotate(-45deg);
				}
			}
		}
		div.thumb {
			width: 64px;
			height: 64px;
			-webkit-box-shadow: $boxShadowLight;
					box-shadow: $boxShadowLight;
		}

		div.info {
			margin-left: 15px;
			text-align: left;
			h4 {
				font-size: 1.5rem;
				a {
					color: $defaultTextColor;
					font-weight: 400;
					&:hover { text-decoration: underline; }
				}
			}
			span { display: block; }
			span:nth-child(3) {
				font-size: 0.9rem;
			}
		}

		div.latest {
			flex-grow: 1;
			justify-content: flex-end;
			display: flex;
			margin-left: 15px;

			span.no-files {
				font-size: 1.5em;
				color: #b1b1b1;
				padding-top: 17px;
			}

			div.more {
				width: 64px;
				height: 64px;
				background: white;
				display: flex;
				align-items: center;
				padding: 10px;
				text-align: center;
				a {
					line-height: 1rem;
					color: $defaultTextColor;
					&:hover { text-decoration: underline; }
				}
			}
		}

		div.details {
			flex: 0 1 100%;
			padding-left: 2em;
			padding-top: 1em;
			min-height: 50px;

			.b-table {
				padding: 2em 0em;

				.table-wrapper {
					-webkit-box-shadow: $boxShadowLight;
							box-shadow: $boxShadowLight;
				}
			}
		}
	}

	div.column > h2.subtitle { padding-top: 1px; }
</style>
<style lang="scss">
	@import '~/assets/styles/_colors.scss';

	.b-table {
		.table-wrapper {
			-webkit-box-shadow: $boxShadowLight;
					box-shadow: $boxShadowLight;
		}
	}
</style>
