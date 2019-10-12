<template>
	<section class="hero is-fullheight dashboard">
		<div class="hero-body">
			<div class="container">
				<div class="columns">
					<div class="column is-narrow">
						<Sidebar />
					</div>
					<div class="column">
						<h2 class="subtitle">Service settings</h2>
						<hr>

						<b-field label="Service name"
							message="Please enter the name which this service is gonna be identified as"
							horizontal>
							<b-input v-model="options.serviceName"
								expanded />
						</b-field>

						<b-field label="Upload folder"
							message="Where to store the files relative to the working directory"
							horizontal>
							<b-input v-model="options.uploadFolder"
								expanded />
						</b-field>

						<b-field label="Links per album"
							message="Maximum links allowed per album"
							horizontal>
							<b-input v-model="options.linksPerAlbum"
								type="number"
								expanded />
						</b-field>

						<b-field label="Max upload size"
							message="Maximum allowed file size in MB"
							horizontal>
							<b-input v-model="options.maxUploadSize"
								expanded />
						</b-field>

						<b-field label="Filename length"
							message="How many characters long should the generated filenames be"
							horizontal>
							<b-input v-model="options.filenameLength"
								expanded />
						</b-field>

						<b-field label="Album link length"
							message="How many characters a link for an album should have"
							horizontal>
							<b-input v-model="options.albumLinkLength"
								expanded />
						</b-field>

						<b-field label="Generate thumbnails"
							message="Generate thumbnails when uploading a file if possible"
							horizontal>
							<b-switch v-model="options.generateThumbnails"
								:true-value="true"
								:false-value="false" />
						</b-field>

						<b-field label="Generate zips"
							message="Allow generating zips to download entire albums"
							horizontal>
							<b-switch v-model="options.generateZips"
								:true-value="true"
								:false-value="false" />
						</b-field>

						<b-field label="Public mode"
							message="Enable anonymous uploades"
							horizontal>
							<b-switch v-model="options.publicMode"
								:true-value="true"
								:false-value="false" />
						</b-field>

						<b-field label="Enable creating account"
							message="Enable creating new accounts in the platform"
							horizontal>
							<b-switch v-model="options.enableAccounts"
								:true-value="true"
								:false-value="false" />
						</b-field>

						<div class="mb2 mt2 text-center">
							<button class="button is-primary"
								@click="promptRestartService">Save and restart service</button>
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
	middleware: ['auth', 'admin'],
	data() {
		return {
			options: {}
		};
	},
	metaInfo() {
		return { title: 'Settings' };
	},
	mounted() {
		this.getSettings();
	},
	methods: {
		async getSettings() {
			const response = await this.$axios.$get(`service/config`);
			this.options = response.config;
		},
		promptRestartService() {
			this.$buefy.dialog.confirm({
				message: 'Keep in mind that restarting only works if you have PM2 or something similar set up. Continue?',
				onConfirm: () => this.restartService()
			});
		},
		async restartService() {
			const response = await this.$axios.$post(`service/restart`);
			this.$buefy.toast.open(response.message);
		}
	}
};
</script>
