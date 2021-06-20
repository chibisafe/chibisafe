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
					box-shadow: $boxShadowLight;
				}
			}
		}
	}

	div.column > h2.subtitle { padding-top: 1px; }

	div.no-background {
		background: none;
	}
</style>
<style lang="scss">
	@import '~/assets/styles/_colors.scss';

	.b-table {
		.table-wrapper {
			box-shadow: $boxShadowLight;
		}
	}
</style>

<template>
	<section class="section is-fullheight dashboard">
		<div class="container">
			<div class="columns">
				<div class="column is-narrow">
					<Sidebar />
				</div>
				<div class="column">
					<h2 class="subtitle">
						Manage your tags
					</h2>
					<hr>

					<div class="search-container">
						<b-field>
							<b-input
								v-model="newTagName"
								class="chibisafe-input"
								placeholder="Tag name..."
								type="text"
								@keyup.enter.native="createTag" />
							<p class="control">
								<b-button
									type="is-chibisafe"
									@click="createTag">
									Create tags
								</b-button>
							</p>
						</b-field>
					</div>

					<div class="view-container">
						<div
							v-for="tag in tags"
							:key="tag.id"
							class="album">
							<div
								class="arrow-container"
								@click="promptDeleteTag(tag.id)">
								<i class="icon-arrow" />
							</div>
							<!--
							<div class="thumb">
								<figure class="image is-64x64 thumb">
									<img src="~/assets/images/blank.png">
								</figure>
							</div>
							-->
							<div class="info">
								<h4>
									<router-link :to="`/dashboard/tags/${tag.id}`">
										{{ tag.name }}
									</router-link>
								</h4>
								<span>{{ tag.count || 0 }} files</span>
							</div>
							<!--
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
										<router-link :to="`/dashboard/albums/${album.uuid}`">{{ album.fileCount - 5 }}+ more</router-link>
									</div>
								</template>
								<template v-else>
									<span class="no-files">Nothing to show here</span>
								</template>
							</div>
							-->
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
			tags: [],
			newTagName: null
		};
	},
	computed: {
		config() {
			return this.$store.state.config;
		}
	},
	metaInfo() {
		return { title: 'Tags' };
	},
	mounted() {
		this.getTags();
	},
	methods: {
		promptDeleteTag(id) {
			this.$buefy.dialog.confirm({
				type: 'is-danger',
				message: 'Are you sure you want to delete this tag?',
				onConfirm: () => this.promptPurgeTag(id)
			});
		},
		promptPurgeTag(id) {
			this.$buefy.dialog.confirm({
				type: 'is-danger',
				message: 'Would you like to delete every file associated with this tag?',
				cancelText: 'No',
				confirmText: 'Yes',
				onConfirm: () => this.deleteTag(id, true),
				onCancel: () => this.deleteTag(id, false)
			});
		},
		async deleteTag(id, purge) {
			const response = await this.$axios.$delete(`tag/${id}/${purge ? 'purge' : ''}`);
			this.getTags();
			return this.$buefy.toast.open(response.message);
		},
		async createTag() {
			if (!this.newTagName || this.newTagName === '') return;
			const response = await this.$axios.$post('tag/new',
				{ name: this.newTagName });
			this.newTagName = null;
			this.$buefy.toast.open(response.message);
			this.getTags();
		},
		async getTags() {
			const response = await this.$axios.$get('tags');
			for (const tag of response.tags) {
				tag.isDetailsOpen = false;
			}
			this.tags = response.tags;
		}
	}
};
</script>
