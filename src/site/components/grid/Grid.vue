<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';
	.item-move {
		transition: all .25s cubic-bezier(.55,0,.1,1);
		-webkit-transition: all .25s cubic-bezier(.55,0,.1,1);
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
				&:before {
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
</style>

<style lang="scss">
	.waterfall-item:hover {
		div.actions {
			opacity: 1
		}
	}
</style>

<template>
	<Waterfall
		:gutterWidth="10"
		:gutterHeight="4">
		<!-- Gotta implement search and pagination here -->
		<input v-model="searchTerm"
			type="text"
			placeholder="Search..."
			@input="search()"
			@keyup.enter="search()">

		<WaterfallItem v-for="(item, index) in files"
			v-if="showWaterfall && item.thumb"
			:key="index"
			:width="width"
			move-class="item-move">
			<template v-if="isPublic">
				<a :href="`${item.url}`"
					target="_blank">
					<img :src="`${item.thumb}`">
				</a>
			</template>
			<template v-else>
				<img :src="`${item.thumb}`">
				<div v-if="!isPublic"
					:class="{ fixed }"
					class="actions">
					<b-tooltip label="Link"
						position="is-top">
						<a :href="`${item.url}`"
							target="_blank">
							<i class="icon-web-code" />
						</a>
					</b-tooltip>
					<b-tooltip label="Albums"
						position="is-top">
						<a @click="$parent.openAlbumModal(item)">
							<i class="icon-interface-window" />
						</a>
					</b-tooltip>
					<b-tooltip label="Tags"
						position="is-top">
						<a @click="manageTags(item)">
							<i class="icon-ecommerce-tag-c" />
						</a>
					</b-tooltip>
					<b-tooltip label="Delete"
						position="is-top">
						<a @click="deleteFile(item, index)">
							<i class="icon-editorial-trash-a-l" />
						</a>
					</b-tooltip>
				</div>
			</template>
		</WaterfallItem>
	</Waterfall>
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
			default: null
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
		}
	},
	data() {
		return {
			showWaterfall: true,
			searchTerm: null
		};
	},
	computed: {
		config() {
			return this.$store.state.config;
		}
	},
	mounted() {
		this.$search.items(this.files);
	},
	methods: {
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
			this.$dialog.confirm({
				title: 'Deleting file',
				message: 'Are you sure you want to <b>delete</b> this file?',
				confirmText: 'Delete File',
				type: 'is-danger',
				hasIcon: true,
				onConfirm: async () => {
					const response = await this.$axios.$delete(`file/${file.id}`);
					this.showWaterfall = false;
					this.files.splice(index, 1);
					this.$nextTick(() => {
						this.showWaterfall = true;
					});
					return this.$toast.open(response.message);
				}
			});
		}
	}
};
</script>
