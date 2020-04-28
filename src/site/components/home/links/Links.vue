<template>
	<div class="links">
		<a href="https://github.com/WeebDev/lolisafe"
			target="_blank"
			class="link">
			<header class="bd-footer-star-header">
				<h4 class="bd-footer-title">GitHub</h4>
				<p class="bd-footer-subtitle">Deploy your own lolisafe</p>
			</header>
		</a>
		<div v-if="loggedIn"
			class="link"
			@click="createShareXThing">
			<header class="bd-footer-star-header">
				<h4 class="bd-footer-title">ShareX</h4>
				<p class="bd-footer-subtitle">Upload from your Desktop</p>
			</header>
		</div>
		<a href="https://chrome.google.com/webstore/detail/lolisafe-uploader/enkkmplljfjppcdaancckgilmgoiofnj"
			target="_blank"
			class="link">
			<header class="bd-footer-star-header">
				<h4 class="bd-footer-title">Extension</h4>
				<p class="bd-footer-subtitle">Upload from any website</p>
			</header>
		</a>
		<router-link to="/faq"
			class="link">
			<header class="bd-footer-star-header">
				<h4 class="bd-footer-title">FAQ</h4>
				<p class="bd-footer-subtitle">We got you covered</p>
			</header>
		</router-link>
	</div>
</template>
<script>
import { saveAs } from 'file-saver';
export default {
	computed: {
		loggedIn() {
			return this.$store.state.loggedIn;
		}
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
					"authorization": "Bearer ${this.$store.state.token}",
					"accept": "application/vnd.lolisafe.json"
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
	.links {
		margin: 7rem 0 3rem 0;
		align-items: stretch;
		display: flex;
		justify-content: space-between;

		div.link { cursor: pointer; }
		.link {
			background: $backgroundAccent;
			display: block;
			width: calc(25% - 2rem);
			border-radius: 6px;
			box-shadow: 0 1.5rem 1.5rem -1.25rem rgba(10,10,10,.05);
			transition-duration: 86ms;
			transition-property: box-shadow,-webkit-transform;
			transition-property: box-shadow,transform;
			transition-property: box-shadow,transform,-webkit-transform;
			will-change: box-shadow,transform;

			header.bd-footer-star-header {
				padding: 1.5rem;

				&:hover .bd-footer-subtitle { color: $textColorHighlight; }

				h4.bd-footer-title {
					color: $textColorHighlight;
					font-size: 1.5rem;
					line-height: 1.25;
					margin-bottom: .5rem;
					transition-duration: 86ms;
					transition-property: color;
					font-weight: 700;
				}

				p.bd-footer-subtitle {
					color: $textColor;
					margin-top: -.5rem;
					transition-duration: 86ms;
					transition-property: color;
					font-weight: 400;
				}
			}

			&:hover {
				box-shadow: 0 3rem 3rem -1.25rem rgba(10,10,10,.1);
				-webkit-transform: translateY(-.5rem);
				transform: translateY(-.5rem);
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
