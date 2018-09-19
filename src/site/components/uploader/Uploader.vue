<template>
	<div :class="{ 'has-files': alreadyAddedFiles }"
		class="uploader-wrapper">
		<b-select v-if="loggedIn"
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
		<dropzone v-if="showDropzone"
			id="dropzone"
			ref="el"
			:options="dropzoneOptions"
			:include-styling="false"
			@vdropzone-success="dropzoneSuccess"
			@vdropzone-error="dropzoneError"
			@vdropzone-files-added="dropzoneFilesAdded" />
		<label class="add-more">
			Add more files
		</label>

		<div id="template"
			ref="template">
			<div class="dz-preview dz-file-preview">
				<div class="dz-details">
					<div class="dz-filename"><span data-dz-name /></div>
					<div class="dz-size"><span data-dz-size /></div>
				</div>
				<div class="result">
					<div class="copyLink">
						<b-tooltip label="Copy link">
							<i class="icon-web-code" />
						</b-tooltip>
					</div>
					<div class="openLink">
						<b-tooltip label="Open file">
							<a class="link"
								target="_blank">
								<i class="icon-web-url" />
							</a>
						</b-tooltip>
					</div>
				</div>
				<div class="error">
					<div>
						<span>
							<span class="error-message"
								data-dz-errormessage />
							<i class="icon-web-warning" />
						</span>
					</div>
				</div>
				<div class="dz-progress">
					<span class="dz-upload"
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
			albums: [],
			selectedAlbum: null
		};
	},
	computed: {
		config() {
			return this.$store.state.config;
		},
		token() {
			return this.$store.state.token;
		},
		loggedIn() {
			return this.$store.state.loggedIn;
		}
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
			autoProcessQueue: true,
			addRemoveLinks: false,
			parallelUploads: 5,
			uploadMultiple: false,
			maxFiles: 1000,
			createImageThumbnails: false,
			paramName: 'file',
			chunking: true,
			retryChunks: true,
			retryChunksLimit: 3,
			parallelChunkUploads: false,
			chunkSize: this.config.chunkSize * 1000000,
			chunksUploaded: this.dropzoneChunksUploaded,
			maxFilesize: this.config.maxFileSize,
			previewTemplate: this.$refs.template.innerHTML,
			dictDefaultMessage: 'Drag & Drop your files or click to browse',
			headers: { Accept: 'application/vnd.lolisafe.json' }
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
				const response = await this.axios.get(`${this.config.baseURL}/albums/dropdown`);
				this.albums = response.data.albums;
				this.updateDropzoneConfig();
			} catch (error) {
				this.$onPromiseError(error);
			}
		},

		/*
			This method needs to be called after the token or selectedAlbum changes
			since dropzone doesn't seem to update the config values unless you force it.
			Tch.
		*/
		updateDropzoneConfig() {
			this.$refs.el.setOption('headers', {
				Accept: 'application/vnd.lolisafe.json',
				Authorization: this.token ? `Bearer ${this.token}` : '',
				albumId: this.selectedAlbum ? this.selectedAlbum : null
			});
		},

		/*
			Dropzone stuff
		*/
		dropzoneFilesAdded(files) {
			this.alreadyAddedFiles = true;
			// console.log(files);
		},
		dropzoneSuccess(file, response) {
			this.processResult(file, response);
		},
		dropzoneError(file, message, xhr) {
			this.$showToast('There was an error uploading this file. Check the console.', true, 5000);
			console.error(file, message, xhr);
		},
		dropzoneChunksUploaded(file, done) {
			const response = JSON.parse(file.xhr.response);
			if (!response.url) {
				console.error('There was a problem uploading the file?');
				return done();
			}

			this.processResult(file, response);
			this.$forceUpdate();
			return done();
		},

		/*
			If upload/s was/were successfull we modify the template so that the buttons for
			copying the returned url or opening it in a new window appear.
		*/
		processResult(file, response) {
			if (!response.url) return;
			file.previewTemplate.querySelector('.link').setAttribute('href', response.url);
			file.previewTemplate.querySelector('.copyLink').addEventListener('click', () => {
				this.$showToast('Link copied!', false, 1000);
				this.$clipboard(response.url);
			});
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
		transition-duration: 86ms;
		transition-property: box-shadow,-webkit-transform;
		transition-property: box-shadow,transform;
		transition-property: box-shadow,transform,-webkit-transform;
		will-change: box-shadow,transform;

		&:hover, &.hasFiles {
			box-shadow: 0 1rem 3rem 0rem rgba(10, 10, 10, 0.25);
			-webkit-transform: translateY(-.5rem);
			transform: translateY(-.5rem);
		}
	}
</style>
<style lang="scss">
	@import '~/assets/styles/_colors.scss';
	.filepond--panel-root {
		background: transparent;
		border: 2px solid #2c3340;
	}
	.filepond--drop-label {
		color: #c7ccd8;
		pointer-events: none;
	}

	.filepond--item-panel {
		background-color: #767b8b;
	}

	.filepond--root .filepond--drip-blob {
		background-color: #7f8a9a
	}

	.filepond--drip {
		background: black;
	}

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
					border: 2px solid #2c3340;
					background: rgba(0, 0, 0, 0.15);
					border-radius: .3em;
					color: $uploaderDropdownColor;
				}
			}
		}
		label.add-more { display: none; }
	}
</style>
