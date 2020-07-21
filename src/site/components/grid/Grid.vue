<template>
	<div>
		<nav class="level">
			<div class="level-left">
				<div class="level-item">
					<slot name="pagination" />
				</div>
			</div>
			<!-- TODO: Externalize this so it can be saved as an user config (and between re-renders) -->
			<div v-if="enableToolbar" class="level-right toolbar">
				<div class="level-item">
					<div class="block">
						<b-radio v-model="showList" name="name" :native-value="true">
							List
						</b-radio>
						<b-radio v-model="showList" name="name" :native-value="false">
							Grid
						</b-radio>
					</div>
				</div>
			</div>
		</nav>

		<template v-if="!showList">
			<Waterfall
				v-if="showWaterfall"
				:gutterWidth="10"
				:gutterHeight="4"
				:options="{fitWidth: true}"
				:itemWidth="width"
				:items="gridFiles">
				<template v-slot="{item}">
					<template v-if="isPublic">
						<a
							:href="`${item.url}`"
							class="preview-container"
							target="_blank"
							@mouseenter.self.stop.prevent="item.preview && mouseOver(item.id)"
							@mouseleave.self.stop.prevent="item.preview && mouseOut(item.id)">

							<img :src="item.thumb ? item.thumb : blank">
							<div v-if="item.preview && isHovered(item.id)" class="preview">
								<video ref="video" class="preview" autoplay loop muted>
									<source :src="item.preview" type="video/mp4">
								</video>
							</div>

							<span v-if="!item.thumb && item.name" class="extension">{{
								item.name.split('.').pop()
							}}</span>
						</a>
					</template>
					<template v-else>
						<img :src="item.thumb ? item.thumb : blank">
						<div v-if="item.preview && isHovered(item.id)" class="preview">
							<video ref="video" class="preview" autoplay loop muted>
								<source :src="item.preview" type="video/mp4">
							</video>
						</div>

						<span v-if="!item.thumb && item.name" class="extension">{{ item.name.split('.').pop() }}</span>
						<div
							v-if="!isPublic"
							:class="{ fixed }"
							class="actions"
							@mouseenter.self.stop.prevent="item.preview && mouseOver(item.id)"
							@mouseleave.self.stop.prevent="item.preview && mouseOut(item.id)">
							<b-tooltip label="Link" position="is-top">
								<a :href="`${item.url}`" target="_blank" class="btn">
									<i class="mdi mdi-open-in-new" />
								</a>
							</b-tooltip>
							<b-tooltip label="Edit" position="is-top">
								<a class="btn" @click="handleFileModal(item)">
									<i class="mdi mdi-pencil" />
								</a>
							</b-tooltip>
							<b-tooltip label="Delete" position="is-top">
								<a class="btn" @click="deleteFile(item)">
									<i class="mdi mdi-delete" />
								</a>
							</b-tooltip>
							<b-tooltip v-if="user && user.isAdmin" label="More info" position="is-top" class="more">
								<nuxt-link :to="`/dashboard/admin/file/${item.id}`">
									<i class="mdi mdi-dots-horizontal" />
								</nuxt-link>
							</b-tooltip>
						</div>
					</template>
				</template>
			</Waterfall>
		</template>
		<div v-else>
			<b-table :data="gridFiles || []" :mobile-cards="true">
				<template slot-scope="props">
					<template v-if="!props.row.hideFromList">
						<b-table-column field="url" label="URL">
							<a :href="props.row.url" target="_blank">{{ props.row.url }}</a>
						</b-table-column>

						<b-table-column field="albums" label="Albums" centered>
							<template v-for="(album, index) in props.row.albums">
								<nuxt-link :key="index" :to="`/dashboard/albums/${album.id}`">
									{{ album.name }}
								</nuxt-link>
								<template v-if="index < props.row.albums.length - 1">
									,
								</template>
							</template>

							{{ props.row.username }}
						</b-table-column>

						<b-table-column field="uploaded" label="Uploaded" centered>
							<span><timeago :since="props.row.createdAt" /></span>
						</b-table-column>

						<b-table-column field="purge" centered>
							<b-tooltip label="Edit" position="is-top">
								<a class="btn" @click="handleFileModal(props.row)">
									<i class="mdi mdi-pencil" />
								</a>
							</b-tooltip>
							<b-tooltip label="Delete" position="is-top" class="is-danger">
								<a class="is-danger" @click="deleteFile(props.row)">
									<i class="mdi mdi-delete" />
								</a>
							</b-tooltip>
							<b-tooltip v-if="user && user.isAdmin" label="More info" position="is-top" class="more">
								<nuxt-link :to="`/dashboard/admin/file/${props.row.id}`">
									<i class="mdi mdi-dots-horizontal" />
								</nuxt-link>
							</b-tooltip>
						</b-table-column>
					</template>
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
					<div class="has-text-right has-text-default">
						Showing {{ files.length }} files ({{ total }} total)
					</div>
				</template>
			</b-table>
		</div>

		<b-modal class="imageinfo-modal" :active.sync="isAlbumsModalActive">
			<ImageInfo :file="modalData.file" :albums="modalData.albums" :tags="modalData.tags" />
		</b-modal>
	</div>
</template>

<script>
import { mapState } from 'vuex';

import Waterfall from './waterfall/Waterfall.vue';
import ImageInfo from '~/components/image-modal/ImageInfo.vue';

export default {
	components: {
		Waterfall,
		ImageInfo,
	},
	props: {
		files: {
			type: Array,
			default: () => [],
		},
		total: {
			type: Number,
			default: 0,
		},
		fixed: {
			type: Boolean,
			default: false,
		},
		isPublic: {
			type: Boolean,
			default: false,
		},
		width: {
			type: Number,
			default: 150,
		},
		enableSearch: {
			type: Boolean,
			default: true,
		},
		enableToolbar: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			showWaterfall: true,
			searchTerm: null,
			showList: false,
			hoveredItems: [],
			isAlbumsModalActive: false,
			showingModalForFile: null,
			filesOffsetWaterfall: 0,
			filesOffsetEndWaterfall: 50,
			filesPerPageWaterfall: 50,
			modalData: {
				file: null,
				tags: null,
				albums: null,
			},
		};
	},
	computed: {
		...mapState({
			user: (state) => state.auth.user,
			albums: (state) => state.albums.tinyDetails,
			images: (state) => state.images,
		}),
		blank() {
			// eslint-disable-next-line global-require, import/no-unresolved
			return require('@/assets/images/blank.png');
		},
		gridFiles() {
			return this.files;
		},
	},
	created() {
		// TODO: Create a middleware for this
		this.getAlbums();
		this.getTags();
	},
	methods: {
		async search() {
			const data = await this.$search.do(this.searchTerm, ['name', 'original', 'type', 'albums:name']);
			console.log('> Search result data', data); // eslint-disable-line no-console
		},
		deleteFile(file) {
			// this.$emit('delete', file);
			this.$buefy.dialog.confirm({
				title: 'Deleting file',
				message: 'Are you sure you want to <b>delete</b> this file?',
				confirmText: 'Delete File',
				type: 'is-danger',
				onConfirm: async () => {
					try {
						const response = await this.$store.dispatch('images/deleteFile', file.id);

						this.$buefy.toast.open(response.message);
					} catch (e) {
						this.$store.dispatch('alert/set', { text: e.message, error: true }, { root: true });
					}
				},
			});
		},
		isAlbumSelected(id) {
			if (!this.showingModalForFile) return false;
			const found = this.showingModalForFile.albums.find((el) => el.id === id);
			return !!(found && found.id);
		},
		async openAlbumModal(file) {
			const { id } = file;
			this.showingModalForFile = file;
			this.showingModalForFile.albums = [];

			try {
				await this.$store.dispatch('images/getFileAlbums', id);
			} catch (e) {
				this.$store.dispatch('alert/set', { text: e.message, error: true }, { root: true });
			}
			this.showingModalForFile.albums = this.images.fileAlbumsMap[id];

			this.isAlbumsModalActive = true;
		},
		async albumCheckboxClicked(add, id) {
			try {
				let response;
				if (add) {
					response = await this.$store.dispatch('images/addToAlbum', {
						albumId: id,
						fileId: this.showingModalForFile.id,
					});
				} else {
					response = await this.$store.dispatch('images/removeFromAlbum', {
						albumId: id,
						fileId: this.showingModalForFile.id,
					});
				}

				this.$buefy.toast.open(response.message);
			} catch (e) {
				this.$store.dispatch('alert/set', { text: e.message, error: true }, { root: true });
			}
		},
		async getAlbums() {
			try {
				await this.$store.dispatch('albums/getTinyDetails');
			} catch (e) {
				this.$store.dispatch('alert/set', { text: e.message, error: true }, { root: true });
			}
		},
		async handleFileModal(file) {
			const { id } = file;

			try {
				await this.$store.dispatch('images/fetchFileMeta', id);
				this.modalData.file = this.images.fileExtraInfoMap[id];
				this.modalData.albums = this.images.fileAlbumsMap[id];
				this.modalData.tags = this.images.fileTagsMap[id];
			} catch (e) {
				this.$store.dispatch('alert/set', { text: e.message, error: true }, { root: true });
			}

			this.isAlbumsModalActive = true;
		},
		async getTags() {
			try {
				await this.$store.dispatch('tags/fetch');
			} catch (e) {
				this.$store.dispatch('alert/set', { text: e.message, error: true }, { root: true });
			}
		},
		mouseOver(id) {
			const foundIndex = this.hoveredItems.indexOf(id);
			if (foundIndex > -1) return;
			this.hoveredItems.push(id);
		},
		mouseOut(id) {
			const foundIndex = this.hoveredItems.indexOf(id);
			if (foundIndex > -1) this.hoveredItems.splice(foundIndex, 1);
		},
		isHovered(id) {
			return this.hoveredItems.includes(id);
		},
	},
};
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_colors.scss';
.item-move {
	transition: all 0.25s cubic-bezier(0.55, 0, 0.1, 1);
}

div.toolbar {
	padding: 1rem;

	.block {
		text-align: right;
	}
}

span.extension {
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 0;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 2rem;
	pointer-events: none;
	opacity: 0.75;
	max-width: 150px;
}

div.preview {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: calc(100% - 6px);
	overflow: hidden;
}

.preview-container {
	display: inline-block;
}

div.actions {
	opacity: 0;
	-webkit-transition: opacity 0.1s linear;
	-moz-transition: opacity 0.1s linear;
	-ms-transition: opacity 0.1s linear;
	-o-transition: opacity 0.1s linear;
	transition: opacity 0.1s linear;
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: calc(100% - 6px);
	// background: rgba(0, 0, 0, 0.5);
	background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0px, rgba(0, 0, 0, 0) 60px),
		linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0px, rgba(0, 0, 0, 0) 45px);
	display: flex;
	justify-content: center;
	align-items: flex-end;

	span {
		padding: 3px;

		&.more {
			position: absolute;
			top: 0;
			right: 0;
		}

		&:nth-child(1),
		&:nth-child(2) {
			align-items: flex-end;
			padding-bottom: 10px;
		}

		&:nth-child(3),
		&:nth-child(4) {
			justify-content: flex-end;
			padding-bottom: 10px;
		}

		a {
			width: 30px;
			height: 30px;
			color: white;
			justify-content: center;
			align-items: center;
			display: flex;
			&.btn:before {
				content: '';
				width: 30px;
				height: 30px;
				border: 1px solid white;
				border-radius: 50%;
				position: absolute;
			}
		}
	}

	&.fixed {
		position: relative;
		opacity: 1;
		background: none;

		a {
			width: auto;
			height: auto;
			color: $defaultTextColor;
			&:before {
				display: none;
			}
		}
	}
}

.albums-container {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	.album {
		flex-basis: 33%;
		text-align: left;
	}
}

.hidden {
	display: none;
}

.waterfall {
	margin: 0 auto;
}

.waterfall-item:hover {
	div.actions {
		opacity: 1;
	}
}

.imageinfo-modal::-webkit-scrollbar {
    width: 0px;  /* Remove scrollbar space */
    background: transparent;  /* Optional: just make scrollbar invisible */
}

i.mdi {
	font-size: 16px;
}

.imageinfo-modal{
	::v-deep .modal-content {
		@media screen and (max-width: 768px) {
			min-height: 100vh;
		}
	}
}
</style>
