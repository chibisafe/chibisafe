<style lang="scss" scoped>
	@import '../../styles/colors.scss';
	section { background-color: $backgroundLight1 !important; }
	section.hero div.hero-body {
		align-items: baseline;
	}

	div.view-container {
		padding: 2rem;
	}

	div.album {
		display: flex;
		margin-bottom: 10px;

		div.thumb {
			width: 64px;
			height: 64px;
			-webkit-box-shadow: $boxShadowLight;
					box-shadow: $boxShadowLight;
		}

		div.info {
			margin-left: 15px;
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

						<h1 class="title">{{ albumName }}</h1>
						<hr>

						<div class="view-container">
							<div v-for="album in albums"
								:key="album.id"
								class="album">
								<div class="thumb">
									<figure class="image is-64x64 thumb">
										<img src="../../assets/images/blank.png">
									</figure>
								</div>
								<div class="info">
									<h4>
										<router-link :to="`/dashboard/albums/${album.id}`">{{ album.name }}</router-link>
									</h4>
									<span>Updated <timeago :since="album.editedAt" /></span>
									<span>{{ album.fileCount || 0 }} files</span>
								</div>
								<div class="latest">
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
import Sidebar from '../../components/sidebar/Sidebar.vue';
import Grid from '../../components/grid/Grid.vue';

export default {
	components: {
		Sidebar,
		Grid
	},
	data() {
		return {
			albums: [],
			newAlbumName: null
		};
	},
	metaInfo() {
		return { title: 'Uploads' };
	},
	mounted() {
		this.getAlbums();
		this.$ga.page({
			page: '/dashboard/albums',
			title: 'Albums',
			location: window.location.href
		});
	},
	methods: {
		async createAlbum() {
			if (!this.newAlbumName || this.newAlbumName === '') return;
			try {
				const response = await this.axios.post(`${this.$config.baseURL}/album/new`,
					{ name: this.newAlbumName });
				this.newAlbumName = null;
				this.$toast.open(response.data.message);
				this.getAlbums();
				return;
			} catch (error) {
				this.$onPromiseError(error);
			}
		},
		async getAlbums() {
			try {
				const response = await this.axios.get(`${this.$config.baseURL}/albums/mini`);
				this.albums = response.data.albums;
				console.log(this.albums);
			} catch (error) {
				console.error(error);
			}
		}
	}
};
</script>
