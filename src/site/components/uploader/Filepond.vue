<template>
	<file-pond
		ref="pond"
		name="test"
		class="pond"
		class-name="my-pond"
		label-idle="Drop files here or click to browse"
		:allow-multiple="true"
		:files="myFiles"
		:max-files="1000"
		:chunk-uploads="true"
		:chunk-size:="50 * 1000000"
		:server="server"
		@init="handleFilePondInit"
		@error="handleFilePondError"
		@addfile="handleFilePondAddFile" />
</template>

<script>
// Import Vue FilePond
import vueFilePond from 'vue-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import FilePond plugins
// Please note that you need to install these plugins separately

// Import image preview plugin styles
// import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

// Import image preview and file type validation plugins
// import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
// import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

// Create component
const FilePond = vueFilePond(); // FilePondPluginFileValidateType, FilePondPluginImagePreview);

export default {
	components: {
		FilePond
	},
	data() {
		return {
			myFiles: [],
			server: {
				url: 'http://localhost:5000',
				process: {
					url: '/api/upload',
					method: 'POST',
					headers: {
						'Accept': 'application/vnd.lolisafe.json'
					},
					timeout: 300000, // 5 minutes
					onload: response => console.log(response)
				}
			}
		};
	},
	methods: {
		handleFilePondInit() {
			console.log('FilePond has initialized');
			console.log(this.$refs.pond);
			// FilePond instance methods are available on `this.$refs.pond`
		},
		handleFilePondError(error) {
			console.log(error);
		},
		handleFilePondAddFile(error, file) {
			console.log(error, file);
		}
	}
};
</script>
<style lang="scss">
.pond {
	width: 400px;
	margin: 0 auto;

	.filepond--browser.filepond--browser {
		height: 100%;
		padding-top: 1.75rem;
		top: 0;
		left: 0;
		width: 100%;
		cursor: pointer;
	}
}

.pond.mini {
	position: absolute;
	width: 300px;
	height: auto;
	top: calc(50% - 40px);
	left: calc(50% - 150px);
}
</style>
