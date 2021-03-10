<template>
	<div class="links">
		<div
			v-if="loggedIn"
			class="link"
			@click="createShareXThing">
			<header class="bd-footer-star-header">
				<h4 class="bd-footer-title">
					ShareX
				</h4>
				<p class="bd-footer-subtitle">
					Download ShareX config
				</p>
			</header>
		</div>
		<router-link
			to="/faq"
			class="link">
			<header class="bd-footer-star-header">
				<h4 class="bd-footer-title">
					FAQ
				</h4>
				<p class="bd-footer-subtitle">
					Frequently Asked Questions
				</p>
			</header>
		</router-link>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import { saveAs } from 'file-saver';

export default {
	computed: {
		...mapGetters({
			loggedIn: 'auth/isLoggedIn',
			apiKey: 'auth/getApiKey'
		})
	},
	methods: {
		createShareXThing() {
			const sharexFile = `{
				"Name": "${this.$store.state.config.serviceName}",
				"DestinationType": "ImageUploader, FileUploader",
				"RequestType": "POST",
				"RequestURL": "${location.origin}/api/upload",
				"FileFormName": "files[]",
				"Headers": {
					"token": "${this.apiKey}",
					"accept": "application/vnd.toshokan.json"
				},
				"ResponseType": "Text",
				"URL": "$json:url$",
				"ThumbnailURL": "$json:thumb$"
			}`;
			const sharexBlob = new Blob([sharexFile], { type: 'application/octet-binary' });
			saveAs(sharexBlob, `${location.hostname}.sxcu`);
		}
	}
};
</script>
<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';
	.links {
		margin: 7rem 0 3rem 0;
		align-items: stretch;
		display: flex;
		justify-content: space-between;

		div.link { cursor: pointer; }
		.link {
			background: #0000002e;
			border: 1px solid #00000061;
			display: block;
			width: calc(40%);
			border-radius: 6px;

			header.bd-footer-star-header {
				padding: 1.5rem;

				&:hover .bd-footer-subtitle {
					color: $base-3;
				}

				h4.bd-footer-title {
					color: $base-3;
					font-size: 1.5rem;
					line-height: 1.25;
					text-decoration: none;
					margin-bottom: .5rem;
					transition-duration: 86ms;
					transition-property: color;
					font-weight: 700;
				}

				p.bd-footer-subtitle {
					color: $textColor;
					text-decoration: none;
					margin-top: -.5rem;
					transition-duration: 86ms;
					transition-property: color;
					font-weight: 400;
				}
			}

		}
	}

	@media screen and (max-width: 768px) {
		.links {
			display: block;
			padding: 0px 2em;
			.link {
				width: 100%;
				margin-bottom: 1.5em;
			}
		}
	}
</style>
