<template>
	<footer>
		<div class="container">
			<div class="columns">
				<div class="column is-narrow">
					<h4>chibisafe</h4>
					<span>© 2017-{{ getYear }}
						<a
							href="https://github.com/pitu"
							class="no-block">Pitu</a>
					</span><br>
					<span>v{{ version }}</span>
				</div>
				<div class="column is-narrow bottom-up">
					<a href="https://github.com/weebdev/chibisafe">GitHub</a>
					<a href="https://patreon.com/pitu">Patreon</a>
					<a href="https://discord.gg/5g6vgwn">Discord</a>
				</div>
				<div class="column is-narrow bottom-up">
					<a
						v-if="loggedIn"
						@click="createShareXThing">ShareX Config</a>
					<a href="https://chrome.google.com/webstore/detail/lolisafe-uploader/enkkmplljfjppcdaancckgilmgoiofnj">Chrome Extension</a>
				</div>
			</div>
		</div>
	</footer>
</template>

<script>
/* eslint-disable no-restricted-globals */

import { mapState, mapGetters } from 'vuex';
import { saveAs } from 'file-saver';

export default {
	computed: {
		...mapGetters({ loggedIn: 'auth/isLoggedIn' }),
		...mapState({
			version: state => state.config.version,
			serviceName: state => state.config.serviceName,
			token: state => state.auth.token
		}),
		getYear() {
			return new Date().getFullYear();
		}
	},
	methods: {
		createShareXThing() {
			const sharexFile = `{
				"Name": "${this.serviceName}",
				"DestinationType": "ImageUploader, FileUploader",
				"RequestType": "POST",
				"RequestURL": "${location.origin}/api/upload",
				"FileFormName": "files[]",
				"Headers": {
					"authorization": "Bearer ${this.token}",
					"accept": "application/vnd.chibisafe.json"
				},
				"ResponseType": "Text",
				"URL": "$json:url$",
				"ThumbnailURL": "$json:url$"
			}`;
			const sharexBlob = new Blob([sharexFile], { type: 'application/octet-binary' });
			saveAs(sharexBlob, `${location.hostname}.sxcu`);
		}
	}
};
</script>

<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';
	footer {
		@media screen and (min-width: 1025px) {
			position: fixed;
			bottom: 0;
			width: 100%;
			> div {
				padding: 1rem 1rem !important;
				max-width: unset !important;
			}
		}

		.container {
			.column {
				text-align: center;
				@media screen and (min-width: 1025px) {
					margin-right: 2rem;
					&.bottom-up {
						display: flex;
						flex-direction: column;
						justify-content: flex-end;
						margin-right: 0;
					}
				}

				a {
					display: block;
					color: $textColor;
					&:hover {
						color: white
					}
					&.no-block {
						display: inherit;
					}
				}
			}
		}
	}
</style>
