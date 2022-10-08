<template>
	<div class="flex flex-col items-center max-w-4xl w-full self-center dark:text-chibisafe-text-light absolute z-10">
		<Header />
	</div>
	<div
		class="flex flex-col items-center h-full max-w-4xl min-h-[900px] w-full self-center dark:text-chibisafe-text-light justify-center"
	>
		<div class="flex w-full mt-16 items-center">
			<div class="flex flex-1 justify-center flex-col">
				<h4 class="font-bold text-7xl">Seriously fast <br />file uploader</h4>
				<p class="mt-10 text-lg pr-16">
					<strong>chibisafe</strong> is a modern and self-hosted take on file uploading services that can
					handle anything you throw at it thanks to it's robust and fast API, chunked uploads support and
					more.
				</p>
				<p class="mt-4 text-lg pr-16">It's easily customizable and deploying your own instance is a breeze.</p>
			</div>

			<div
				ref="dropzone"
				class="w-80 h-80 max-w-[320px] bg-[#181a1b] rounded-3xl border-4 shadow-lg border-[#303436] flex items-center justify-center blueprint flex-col cursor-pointer hover:border-[#3b3e40]"
			>
				<IconUpload class="h-12 w-12 pointer-events-none" />
				<h3 class="font-bold text-center mt-4 pointer-events-none">
					DROP FILES OR <br /><span class="text-blue-400">CLICK HERE</span>
				</h3>
				<p class="text-center mt-4 w-3/4 pointer-events-none">
					Drag and drop your files here. Max 10 files. No filesize limit.
				</p>
			</div>
		</div>

		<div class="flex w-full mt-32 flex-col">
			<h3 class="font-bold text-4xl">Some of chibisafe's features</h3>
			<h5 class="text-blue-400">Did we mention that extending it is super easy?</h5>

			<dl
				class="mt-8 space-y-10 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4 sm:space-y-0 lg:grid-cols-4 lg:gap-x-8"
			>
				<div v-for="feature in features" :key="feature" class="relative">
					<dt>
						<IconCheck class="absolute h-6 w-6 text-green-500" aria-hidden="true" />
						<p class="ml-9 text-lg font-medium leading-6 text-gray-900 dark:text-chibisafe-text-light">
							{{ feature }}
						</p>
					</dt>
				</div>
			</dl>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Dropzone from 'dropzone';
import Header from '~/components/header/Header.vue';

// @ts-ignore
import IconUpload from '~icons/carbon/cloud-upload';
// @ts-ignore
import IconCheck from '~icons/carbon/checkmark';

const dropzone = ref<HTMLDivElement>();
const features = ref([
	'Chunked uploads',
	'Sharing links',
	'Albums/Folders',
	'File management',
	'File tagging',
	'User management',
	'API support',
	'Customizable',
	'Open source',
	'Easy to deploy',
	'Docker support',
	'Super Fast',
	'Extensible',
	'No ads',
	'No tracking'
]);

onMounted(() => {
	if (dropzone.value) {
		const drop = new Dropzone(dropzone.value, {
			url: '/api/upload',
			paramName: 'files[]',
			autoProcessQueue: true,
			chunking: true,
			chunkSize: 5 * 1e6, // MB
			chunksUploaded: (file, done) => {
				void fetch('/api/upload', {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json;charset=utf-8'
					},
					body: JSON.stringify({
						files: [
							{
								uuid: file.upload?.uuid,
								original: file.name,
								type: file.type,
								size: file.size
							}
						]
					})

					// This API supports an array of multiple files
				});
				done();
			}
		});
	}
});
</script>
