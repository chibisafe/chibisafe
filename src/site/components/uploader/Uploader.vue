<template>
	<div
		:class="{ 'has-files': alreadyAddedFiles, }"
		class="uploader-wrapper">
		<b-select
			v-if="loggedIn"
			v-model="selectedAlbum"
			placeholder="Upload to album"
			size="is-medium"
			expanded>
			<option
				v-for="album in albums"
				:key="album.id"
				:value="album.id">
				{{ album.name }}
			</option>
		</b-select>
		<dropzone
			v-if="showDropzone"
			id="dropzone"
			ref="el"
			:options="dropzoneOptions"
			:include-styling="false"
			@vdropzone-success="dropzoneSuccess"
			@vdropzone-error="dropzoneError"
			@vdropzone-files-added="dropzoneFilesAdded" />
		<label class="add-more">
			Add or drop more files
		</label>

		<div
			id="template"
			ref="template">
			<div class="dz-preview dz-file-preview">
				<div class="dz-details">
					<div class="dz-filename">
						<span data-dz-name />
					</div>
					<div class="dz-size">
						<span data-dz-size />
					</div>
				</div>
				<div class="result">
					<div class="openLink">
						<a
							class="link"
							target="_blank">
							Link
						</a>
					</div>
				</div>
				<div class="error">
					<div>
						<span>
							<span
								class="error-message"
								data-dz-errormessage />
							<i class="icon-web-warning" />
						</span>
					</div>
				</div>
				<div class="dz-progress">
					<span
						class="dz-upload"
						data-dz-uploadprogress />
				</div>
				<!--
				<div class="dz-error-message"><span data-dz-errormessage/></div>
				<div class="dz-success-mark"><i class="fa fa-check"/></div>
				<div class="dz-error-mark"><i class="fa fa-close"/></div>
				-->
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import Dropzone from 'nuxt-dropzone';
import '~/assets/styles/dropzone.scss';

export default {
	components: { Dropzone },
	data() {
		return {
			alreadyAddedFiles: false,
			files: [],
			dropzoneOptions: {},
			showDropzone: false,
			selectedAlbum: null
		};
	},
	computed: {
		...mapState({
			config: state => state.config,
			albums: state => state.albums.tinyDetails
		}),
		...mapGetters({ loggedIn: 'auth/isLoggedIn', token: 'auth/getToken' })
	},
	watch: {
		loggedIn() {
			this.getAlbums();
		},
		selectedAlbum() {
			this.updateDropzoneConfig();
		}
	},
	mounted() {
		this.dropzoneOptions = {
			url: `${this.config.baseURL}/upload`,
			timeout: 600000, // 10 minutes
			autoProcessQueue: true,
			addRemoveLinks: false,
			parallelUploads: 5,
			uploadMultiple: false,
			maxFiles: 1000,
			createImageThumbnails: false,
			paramName: 'files[]',
			forceChunking: false,
			chunking: true,
			retryChunks: true,
			retryChunksLimit: 3,
			parallelChunkUploads: false,
			chunkSize: this.config.chunkSize * 1000000,
			chunksUploaded: this.dropzoneChunksUploaded,
			maxFilesize: this.config.maxUploadSize,
			previewTemplate: this.$refs.template.innerHTML,
			dictDefaultMessage: 'Drag & Drop your files or click to browse',
			headers: { Accept: 'application/vnd.chibisafe.json' }
		};
		this.showDropzone = true;
		if (this.loggedIn) this.getAlbums();
	},
	methods: {
		/*
			Get all available albums so the user can upload directly to one (or several soon™) of them.
		*/
		async getAlbums() {
			try {
				await this.$store.dispatch('albums/getTinyDetails');
			} catch (e) {
				this.$store.dispatch('alert/set', { text: e.message, error: true }, { root: true });
			}
			this.updateDropzoneConfig();
		},

		/*
			This method needs to be called after the token or selectedAlbum changes
			since dropzone doesn't seem to update the config values unless you force it.
			Tch.
		*/
		updateDropzoneConfig() {
			this.$refs.el.setOption('headers', {
				Accept: 'application/vnd.chibisafe.json',
				Authorization: this.token ? `Bearer ${this.token}` : '',
				albumId: this.selectedAlbum ? this.selectedAlbum : null
			});
		},

		/*
			Dropzone stuff
		*/
		dropzoneFilesAdded() {
			this.alreadyAddedFiles = true;
		},
		dropzoneSuccess(file, response) {
			this.processResult(file, response);
		},
		dropzoneError(file, message, xhr) {
			this.$store.dispatch('alert', {
				text: 'There was an error uploading this file. Check the console.',
				error: true
			});
			// eslint-disable-next-line no-console
			console.error(file, message, xhr);
		},
		async dropzoneChunksUploaded(file, done) {
			const { data } = await this.$axios.post('/upload', {
				files: [{
					uuid: file.upload.uuid,
					original: file.name,
					size: file.size,
					type: file.type,
					count: file.upload.totalChunkCount
				}]
			}, {
				headers: {
					albumId: this.selectedAlbum ? this.selectedAlbum : null,
					finishedChunks: true
				}
			});

			this.processResult(file, data);
			return done();
		},

		/*
			If upload/s was/were successfull we modify the template so that the buttons for
			copying the returned url or opening it in a new window appear.
		*/
		processResult(file, response) {
			if (!response.url) return;
			file.previewTemplate.querySelector('.link').setAttribute('href', response.url);
			/*
			file.previewTemplate.querySelector('.copyLink').addEventListener('click', () => {
				this.$store.dispatch('alert', {
					text: 'Link copied!'
				});
				this.$clipboard(response.url);
			});
			*/
		}
	}
};
</script>
<style lang="scss" scoped>
	#template { display: none; }
	.uploader-wrapper {
		display: block;
		width: 400px;
		margin: 0 auto;
		max-width: 100%;
		position: relative;
	}
</style>
<style lang="scss">
	@import '~/assets/styles/_colors.scss';

	div.uploader-wrapper {
		&.has-files {
			#dropzone {
				padding-bottom: 50px;
			}
			label.add-more {
				position: absolute;
				bottom: 23px;
				width: 100%;
				text-align: center;
				color: #797979;
				display: block;
				pointer-events: none;
			}
		}
		div.control {
			margin-bottom: 5px;
			span.select {
				select {
					border: 1px solid #00000061;
					background: rgba(0, 0, 0, 0.15);
					border-radius: .3em;
					color: $uploaderDropdownColor;
					padding: 0 0 0 1rem;
				}
			}
		}
		label.add-more { display: none; }
	}
</style>
