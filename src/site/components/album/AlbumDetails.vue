<template>
	<div class="details">
		<h2>Public links for this album:</h2>

		<b-table
			:data="details.links || []"
			:mobile-cards="true">
			<b-table-column
				v-slot="props"
				field="identifier"
				label="Link"
				centered>
				<a
					:href="`${config.URL}/a/${props.row.identifier}`"
					target="_blank">
					{{ props.row.identifier }}
				</a>
			</b-table-column>

			<b-table-column
				v-slot="props"
				field="views"
				label="Views"
				centered>
				{{ props.row.views }}
			</b-table-column>

			<b-table-column
				v-slot="props"
				field="enableDownload"
				label="Allow download"
				centered>
				<b-switch
					v-model="props.row.enableDownload"
					@input="updateLinkOptions(albumId, props.row)" />
			</b-table-column>

			<b-table-column
				v-slot="props"
				field="enabled"
				numeric>
				<button
					:class="{ 'is-loading': isDeleting(props.row.identifier) }"
					class="button is-danger"
					:disabled="isDeleting(props.row.identifier)"
					@click="promptDeleteAlbumLink(albumId, props.row.identifier)">
					Delete link
				</button>
			</b-table-column>

			<template slot="empty">
				<div class="has-text-centered">
					<i class="icon-misc-mood-sad" />
				</div>
				<div class="has-text-centered">
					Nothing here
				</div>
			</template>

			<template slot="footer">
				<div class="level is-paddingless">
					<div class="level-left">
						<div class="level-item">
							<b-field v-if="auth.user.isAdmin">
								<p class="control">
									<button
										:class="{ 'is-loading': isCreatingLink }"
										class="button is-primary reset-font-size-button"
										style="float: left"
										@click="createLink(albumId)">
										Create new link
									</button>
								</p>
								<p class="control">
									<b-dropdown>
										<button slot="trigger" class="button is-primary reset-font-size-button">
											<b-icon icon="menu-down" />
										</button>

										<b-dropdown-item @click="createCustomLink(albumId)">
											Custom link
										</b-dropdown-item>
									</b-dropdown>
								</p>
							</b-field>
							<button
								v-else
								:class="{ 'is-loading': isCreatingLink }"
								class="button is-primary"
								style="float: left"
								@click="createLink(albumId)">
								Create new link
							</button>
						</div>
						<div class="level-item">
							<span class="has-text-default">{{ details.links.length }} links created</span>
						</div>
					</div>

					<div class="level-right">
						<div class="level-item">
							<b-switch
								:value="nsfw"
								:rounded="false"
								type="is-warning"
								class="has-text-light"
								left-label
								@input="toggleNsfw()">
								NSFW
							</b-switch>
						</div>
						<div class="level-item">
							<button
								class="button is-danger"
								style="float: right"
								@click="promptDeleteAlbum(albumId)">
								Delete album
							</button>
						</div>
					</div>
				</div>
			</template>
		</b-table>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
	props: {
		albumId: {
			'type': Number,
			'default': 0
		},
		details: {
			'type': Object,
			'default': () => ({})
		},
		nsfw: {
			'type': Boolean,
			'default': false
		}
	},
	data() {
		return {
			isCreatingLink: false,
			isDeletingLinks: []
		};
	},
	computed: {
		...mapState(['config', 'auth'])
	},
	methods: {
		...mapActions({
			deleteAlbumAction: 'albums/deleteAlbum',
			deleteAlbumLinkAction: 'albums/deleteLink',
			updateLinkOptionsAction: 'albums/updateLinkOptions',
			createLinkAction: 'albums/createLink',
			createCustomLinkAction: 'albums/createCustomLink',
			toggleNsfwAction: 'albums/toggleNsfw',
			alert: 'alert/set'
		}),
		promptDeleteAlbum(id) {
			this.$buefy.dialog.confirm({
				type: 'is-danger',
				message: 'Are you sure you want to delete this album?',
				onConfirm: () => this.deleteAlbum(id)
			});
		},
		promptDeleteAlbumLink(albumId, identifier) {
			this.$buefy.dialog.confirm({
				type: 'is-danger',
				message: 'Are you sure you want to delete this album link?',
				onConfirm: () => this.deleteAlbumLink(albumId, identifier)
			});
		},
		async deleteAlbum(id) {
			try {
				const response = await this.deleteAlbumAction(id);

				this.alert({ text: response.message, error: false });
			} catch (e) {
				this.alert({ text: e.message, error: true });
			}
		},
		async deleteAlbumLink(albumId, identifier) {
			this.isDeletingLinks.push(identifier);
			try {
				const response = await this.deleteAlbumLinkAction({ albumId, identifier });

				this.alert({ text: response.message, error: false });
			} catch (e) {
				this.alert({ text: e.message, error: true });
			} finally {
				this.isDeletingLinks = this.isDeletingLinks.filter(e => e !== identifier);
			}
		},
		async createLink(albumId) {
			this.isCreatingLink = true;
			try {
				const response = await this.createLinkAction(albumId);

				this.alert({ text: response.message, error: false });
			} catch (e) {
				this.alert({ text: e.message, error: true });
			} finally {
				this.isCreatingLink = false;
			}
		},
		async updateLinkOptions(albumId, linkOpts) {
			try {
				const response = await this.updateLinkOptionsAction({ albumId, linkOpts });

				this.alert({ text: response.message, error: false });
			} catch (e) {
				this.alert({ text: e.message, error: true });
			}
		},
		async toggleNsfw() {
			try {
				const response = await this.toggleNsfwAction({
					albumId: this.albumId,
					nsfw: !this.nsfw
				});
				this.alert({ text: response.message, error: false });
			} catch (e) {
				this.alert({ text: e.message, error: true });
			}
		},
		async createCustomLink(albumId) {
			this.$buefy.dialog.prompt({
				message: 'Custom link identifier',
				inputAttrs: {
					placeholder: '',
					maxlength: 10
				},
				trapFocus: true,
				onConfirm: value => this.$handler.executeAction('albums/createCustomLink', { albumId, value })
			});
		},
		isDeleting(identifier) {
			return this.isDeletingLinks.indexOf(identifier) > -1;
		}
	}
};
</script>

<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';

	.reset-font-size-button {
		font-size: 1rem;
		height: 2.25em;
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
</style>

<style lang="scss">
	@import '~/assets/styles/_colors.scss';

	.b-table {
		.table-wrapper {
			box-shadow: $boxShadowLight;
		}
	}

	.dialog.modal .modal-card-body input {
		border: 2px solid #21252d;
		border-radius: 0.3em !important;
		background: rgba(0, 0, 0, 0.15);
		padding: 1rem;
		color: $textColor;
		height: 3rem;
		&:focus,
		&:hover {
			border: 2px solid #21252d;
		}
		&::placeholder {
			color: $textColor;
		}
	}
</style>
