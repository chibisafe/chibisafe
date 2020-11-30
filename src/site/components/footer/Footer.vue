<template>
	<footer>
		<svg viewBox="0 0 1920 250"
			class="waves">
			<path d="M1920 250H0V0s126.707 78.536 349.975 80.05c177.852 1.203 362.805-63.874 553.803-63.874 290.517 0 383.458 57.712 603.992 61.408 220.527 3.696 278.059-61.408 412.23-17.239"
				class="wave-1" />
			<path d="M1920 144s-467.917 116.857-1027.243-17.294C369.986 1.322 0 45.578 0 45.578V250h1920V144z"
				class="wave-2" />
			<path d="M0 195.553s208.547-75.581 701.325-20.768c376.707 41.908 520.834-67.962 722.545-67.962 222.926 0 311.553 83.523 496.129 86.394V250H0v-54.447z"
				class="wave-3" />
		</svg>
		<div>
			<div class="container">
				<div class="columns">
					<div class="column is-narrow">
						<h4>waffsafe</h4>
						<span>lolisafe v{{ version }}-dev</span>
					</div>
					<div class="column">
						<div class="columns is-gapless">
							<div class="column" />
							<div class="column">
								<nuxt-link to="/">Home</nuxt-link>
								<nuxt-link to="/faq">FAQ</nuxt-link>
							</div>
							<div class="column">
								<nuxt-link to="/dashboard">Dashboard</nuxt-link>
								<nuxt-link to="/dashboard">Files</nuxt-link>
								<nuxt-link to="/dashboard/albums">Albums</nuxt-link>
								<nuxt-link to="/dashboard/account">Account</nuxt-link>
							</div>
							<div class="column">
								<a v-if="loggedIn"
									@click="createShareXThing">ShareX Config</a>
								<a href="https://chrome.google.com/webstore/detail/lolisafe-uploader/enkkmplljfjppcdaancckgilmgoiofnj">Chrome Extension</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</footer>
</template>
<script>
import { saveAs } from 'file-saver';
export default {
	computed: {
		loggedIn() {
			return this.$store.state.loggedIn;
		},
		version() {
			return this.$store.state.config.version;
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
	footer {
		svg.waves {
			.wave-1 {
				fill: rgb(55, 61, 76);
				transition: fill 400ms ease-in-out 0s;
			}

			.wave-2 {
				fill: rgb(57, 64, 79);
				transition: fill 400ms ease-in-out 0s;
			}

			.wave-3 {
				fill: rgb(59, 66, 82);
				transition: fill 400ms ease-in-out 0s;
			}
		}

		> div {
			background: rgb(59, 66, 82);
			padding: 3em 0;
			@media screen and (max-width: 1024px) {
				padding: 3em 3em;
			}
		}

		.container .column a {
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
</style>
