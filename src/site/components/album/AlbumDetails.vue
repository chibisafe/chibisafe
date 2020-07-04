<template>
	<div class="details">
		<h2>Public links for this album:</h2>

		<b-table
			:data="details.links || []"
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
						@input="updateLinkOptions(albumId, props.row)" />
				</b-table-column>

				<b-table-column field="enabled"
					numeric>
					<button class="button is-danger"
						@click="promptDeleteAlbumLink(albumId, props.row.identifier)">Delete link</button>
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
				<div class="level is-paddingless">
					<div class="level-left">
						<div class="level-item">
							<button :class="{ 'is-loading': isCreatingLink }"
								class="button is-primary"
								style="float: left"
								@click="createLink(albumId)">Create new link</button>
						</div>
						<div class="level-item">
							<span class="has-text-default">{{ details.links.length }} / {{ config.maxLinksPerAlbum }} links created</span>
						</div>
					</div>

					<div class="level-right">
						<div class="level-item">
							<button class="button is-danger"
								style="float: right"
								@click="promptDeleteAlbum(albumId)">Delete album</button>
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
			type: Number,
			default: 0
		},
		details: {
			type: Object,
			default: () => ({})
		},
	},
	data() {
		return {
			isCreatingLink: false
		}
	},
	computed: mapState(['config']),
	methods: {
		...mapActions({
			deleteAlbumAction: 'albums/deleteAlbum',
			deleteAlbumLinkAction: 'albums/deleteLink',
			updateLinkOptionsAction: 'albums/updateLinkOptions',
			createLinkAction: 'albums/createLink',
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
				onConfirm: () => this.deleteAlbumLink({ albumId, identifier })
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
		async deleteAlbumLink(id) {
			try {
				const response = await this.deleteAlbumLinkAction(id);

				this.alert({ text: response.message, error: false });
			} catch (e) {
				this.alert({ text: e.message, error: true });
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
		}
	}
};
</script>

<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';

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
