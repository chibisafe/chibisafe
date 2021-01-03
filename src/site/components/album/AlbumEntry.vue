<template>
	<div class="album">
		<div
			class="arrow-container"
			@click="toggleDetails(album)">
			<i
				:class="{ active: isExpanded }"
				class="icon-arrow" />
		</div>
		<div class="thumb">
			<figure class="image is-64x64 thumb">
				<img src="~/assets/images/blank_darker.png">
			</figure>
		</div>
		<div class="info">
			<h4>
				<router-link :to="`/dashboard/albums/${album.id}`">
					{{ album.name }}
				</router-link>
			</h4>
			<span>
				Created <span class="is-inline has-text-weight-semibold"><timeago :since="album.createdAt" /></span>
			</span>
			<span>{{ album.fileCount || 0 }} files</span>
		</div>
		<div class="latest is-hidden-mobile">
			<template v-if="album.fileCount > 0">
				<div
					v-for="file of album.files"
					:key="file.id"
					class="thumb">
					<figure class="image is-64x64">
						<a
							:href="file.url"
							target="_blank">
							<img :src="file.thumbSquare">
						</a>
					</figure>
				</div>
				<div
					v-if="album.fileCount > 5"
					class="thumb more no-background">
					<router-link :to="`/dashboard/albums/${album.id}`">
						{{ album.fileCount - 5 }}+ more
					</router-link>
				</div>
			</template>
			<template v-else>
				<span class="no-files">Nothing to show here</span>
			</template>
		</div>

		<AlbumDetails
			v-if="isExpanded"
			:details="getDetails(album.id)"
			:album-id="album.id"
			:nsfw="album.nsfw" />
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import AlbumDetails from '~/components/album/AlbumDetails.vue';

export default {
	components: {
		AlbumDetails
	},
	props: {
		album: {
			'type': Object,
			'default': () => ({})
		}
	},
	computed: {
		...mapGetters({
			isExpandedGetter: 'albums/isExpanded',
			getDetails: 'albums/getDetails'
		}),
		isExpanded() {
			return this.isExpandedGetter(this.album.id);
		}
	},
	methods: {
		async toggleDetails(album) {
			if (!this.isExpanded) {
				await this.$store.dispatch('albums/fetchDetails', album.id);
			}
			this.$store.commit('albums/toggleExpandedState', album.id);
		}
	}
};
</script>

<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';

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
				transition: transform 0.1s linear;

				&.active {
					transform: rotate(-45deg);
				}
			}
		}

		div.thumb {
			width: 64px;
			height: 64px;
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
	}

	div.no-background { background: none !important; }
</style>
