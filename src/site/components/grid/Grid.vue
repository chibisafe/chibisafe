<template>
	<div>
		<div v-if="enableToolbar"
			class="toolbar">
			<div class="block">
				<b-radio v-model="showList"
					name="name"
					:native-value="true">
					List
				</b-radio>
				<b-radio v-model="showList"
					name="name"
					:native-value="false">
					Grid
				</b-radio>
			</div>
		</div>

		<template v-if="!showList">
			<Waterfall :gutterWidth="10"
				:gutterHeight="4">
				<!--
					TODO: Implement search based on originalName, albumName and tags
					<input v-if="enableSearch"
						v-model="searchTerm"
						type="text"
						placeholder="Search..."
						@input="search()"
						@keyup.enter="search()">
				-->

				<!-- TODO: Implement pagination -->

				<WaterfallItem v-for="(item, index) in gridFiles"
					v-if="showWaterfall"
					:key="index"
					:width="width"
					move-class="item-move">
					<template v-if="isPublic">
						<a :href="`${item.url}`"
							target="_blank">
							<img :src="item.thumb ? item.thumb : blank">
							<span v-if="!item.thumb && item.name"
								class="extension">{{ item.name.split('.').pop() }}</span>
						</a>
					</template>
					<template v-else>
						<img :src="item.thumb ? item.thumb : blank">
						<span v-if="!item.thumb && item.name"
							class="extension">{{ item.name.split('.').pop() }}</span>
						<div v-if="!isPublic"
							:class="{ fixed }"
							class="actions">
							<b-tooltip label="Link"
								position="is-top">
								<a :href="`${item.url}`"
									target="_blank"
									class="btn">
									<i class="icon-web-code" />
								</a>
							</b-tooltip>
							<b-tooltip label="Albums"
								position="is-top">
								<a class="btn"
									@click="openAlbumModal(item)">
									<i class="icon-interface-window" />
								</a>
							</b-tooltip>
							<!--
							<b-tooltip label="Tags"
								position="is-top">
								<a @click="manageTags(item)">
									<i class="icon-ecommerce-tag-c" />
								</a>
							</b-tooltip>
							-->
							<b-tooltip label="Delete"
								position="is-top">
								<a class="btn"
									@click="deleteFile(item, index)">
									<i class="icon-editorial-trash-a-l" />
								</a>
							</b-tooltip>
							<b-tooltip v-if="user && user.isAdmin"
								label="More info"
								position="is-top"
								class="more">
								<nuxt-link :to="`/dashboard/admin/file/${item.id}`">
									<i class="icon-interface-more" />
								</nuxt-link>
							</b-tooltip>
						</div>
					</template>
				</WaterfallItem>
			</Waterfall>
			<button
				v-if="moreFiles"
				class="button is-primary"
				@click="loadMoreFiles">Load more</button>
		</template>
		<div v-else>
			<b-table
				:data="gridFiles || []"
				:mobile-cards="true">
				<template slot-scope="props">
					<template v-if="!props.row.hideFromList">
						<b-table-column field="url"
							label="URL">
							<a :href="props.row.url"
								target="_blank">{{ props.row.url }}</a>
						</b-table-column>

						<b-table-column field="albums"
							label="Albums"
							centered>
							<template v-for="(album, index) in props.row.albums">
								<nuxt-link :key="index"
									:to="`/dashboard/albums/${album.id}`">
									{{ album.name }}
								</nuxt-link>
								<template v-if="index < props.row.albums.length - 1">, </template>
							</template>

							{{ props.row.username }}
						</b-table-column>

						<b-table-column field="uploaded"
							label="Uploaded"
							centered>
							<span><timeago :since="props.row.createdAt" /></span>
						</b-table-column>

						<b-table-column field="purge"
							centered>
							<b-tooltip label="Albums"
								position="is-top">
								<a class="btn"
									@click="openAlbumModal(props.row)">
									<i class="icon-interface-window" />
								</a>
							</b-tooltip>
							<b-tooltip label="Delete"
								position="is-top"
								class="is-danger">
								<a class="is-danger"
									@click="deleteFile(props.row)">
									<i class="icon-editorial-trash-a-l" />
								</a>
							</b-tooltip>
							<b-tooltip v-if="user && user.isAdmin"
								label="More info"
								position="is-top"
								class="more">
								<nuxt-link :to="`/dashboard/admin/file/${props.row.id}`">
									<i class="icon-interface-more" />
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
					<div class="has-text-right">
						{{ files.length }} files
					</div>
				</template>
			</b-table>
			<button
				v-if="moreFiles"
				class="button is-primary mt2"
				@click="loadMoreFiles">Load more</button>
		</div>
		<b-modal :active.sync="isAlbumsModalActive"
			:width="640"
			scroll="keep">
			<div class="card albumsModal">
				<div class="card-content">
					<div class="content">
						<h3 class="subtitle">Select the albums this file should be a part of</h3>
						<hr>
						<div class="albums-container">
							<div v-for="(album, index) in albums"
								:key="index"
								class="album">
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
	</div>
</template>
<script>
import Waterfall from './waterfall/Waterfall.vue';
import WaterfallItem from './waterfall/WaterfallItem.vue';

export default {
	components: {
		Waterfall,
		WaterfallItem
	},
	props: {
		files: {
			type: Array,
			default: () => []
		},
		fixed: {
			type: Boolean,
			default: false
		},
		isPublic: {
			type: Boolean,
			default: false
		},
		width: {
			type: Number,
			default: 150
		},
		enableSearch: {
			type: Boolean,
			default: true
		},
		enableToolbar: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			showWaterfall: true,
			searchTerm: null,
			showList: false,
			albums: [],
			isAlbumsModalActive: false,
			showingModalForFile: null,
			filesOffset: 0,
			filesOffsetEnd: 50,
			filesPerPage: 50
		};
	},
	computed: {
		user() {
			return this.$store.state.user;
		},
		blank() {
			return require('@/assets/images/blank2.jpg');
		},
		gridFiles() {
			return this.files.slice(this.filesOffset, this.filesOffsetEnd);
		},
		moreFiles() {
			return this.files.length > this.filesOffsetEnd;
		}
	},
	methods: {
		loadMoreFiles() {
			this.filesOffsetEnd = this.filesOffsetEnd + this.filesPerPage;
		},
		async search() {
			const data = await this.$search.do(this.searchTerm, [
				'name',
				'original',
				'type',
				'albums:name'
			]);
			console.log('> Search result data', data);
		},
		deleteFile(file, index) {
			this.$buefy.dialog.confirm({
				title: 'Deleting file',
				message: 'Are you sure you want to <b>delete</b> this file?',
				confirmText: 'Delete File',
				type: 'is-danger',
				hasIcon: true,
				onConfirm: async () => {
					const response = await this.$axios.$delete(`file/${file.id}`);
					if (this.showList) {
						file.hideFromList = true;
						this.$forceUpdate();
					} else {
						this.showWaterfall = false;
						this.files.splice(index, 1);
						this.$nextTick(() => {
							this.showWaterfall = true;
						});
					}
					return this.$buefy.toast.open(response.message);
				}
			});
		},
		isAlbumSelected(id) {
			if (!this.showingModalForFile) return;
			const found = this.showingModalForFile.albums.find(el => el.id === id);
			return found ? found.id ? true : false : false;
		},
		async openAlbumModal(file) {
			this.showingModalForFile = file;
			this.showingModalForFile.albums = [];
			this.isAlbumsModalActive = true;

			const response = await this.$axios.$get(`file/${file.id}/albums`);
			this.showingModalForFile.albums = response.albums;

			this.getAlbums();
		},
		async albumCheckboxClicked(value, id) {
			const response = await this.$axios.$post(`file/album/${value ? 'add' : 'del'}`, {
				albumId: id,
				fileId: this.showingModalForFile.id
			});
			this.$buefy.toast.open(response.message);

			// Not the prettiest solution to refetch on each click but it'll do for now
			this.$parent.getFiles();
		},
		async getAlbums() {
			const response = await this.$axios.$get(`albums/dropdown`);
			this.albums = response.albums;
			this.$forceUpdate();
		}
	}
};
</script>
<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';
	.item-move {
		transition: all .25s cubic-bezier(.55,0,.1,1);
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
		opacity: .75;
		max-width: 150px;
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
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;

		span {
			padding: 3px;
			&.more {
				position: absolute;
				top: 0;
				right: 0;
			}

			&:nth-child(1), &:nth-child(2) {
				align-items: flex-end;
			}

			&:nth-child(1), &:nth-child(3) {
				justify-content: flex-end;
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
</style>

<style lang="scss">
	.waterfall-item:hover {
		div.actions {
			opacity: 1
		}
	}
</style>
