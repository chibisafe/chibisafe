<template>
	<div
		ref="dropzone"
		class="absolute w-80 h-auto min-h-[320px] max-w-[320px] right-0 top-0 bg-[#181a1b] rounded-3xl border-4 shadow-lg border-[#303436] flex items-center justify-center blueprint flex-col cursor-pointer hover:border-[#3b3e40] transform-gpu transition-all"
	>
		<IconUpload class="h-12 w-12 pointer-events-none" />
		<h3 class="font-bold text-center mt-4 pointer-events-none">
			DROP FILES OR <br /><span class="text-blue-400">CLICK HERE</span>
		</h3>
		<p class="text-center mt-4 w-3/4 pointer-events-none mb-4">
			Drag and drop your files here. Max 10 files. No filesize limit.
		</p>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import Dropzone from 'dropzone';
import { useUploadsStore } from '~/store/uploads';
import { useUserStore } from '~/store/user';
import type { ApiError } from '~/types';

// @ts-ignore
import IconUpload from '~icons/carbon/cloud-upload';

const userStore = useUserStore();
const uploadsStore = useUploadsStore();
const dropzone = ref<HTMLDivElement>();

const isLoggedIn = computed(() => userStore.loggedIn);
const token = computed(() => userStore.token);

onMounted(() => {
	if (dropzone.value) {
		const drop = new Dropzone(dropzone.value, {
			url: '/api/upload',
			paramName: 'files[]',
			timeout: 600000, // 10 minutes
			parallelUploads: 5,
			autoProcessQueue: true,
			chunking: true,
			chunkSize: 5 * 1e6, // 5MB
			maxFilesize: 100 * 1e6, // 100MB
			createImageThumbnails: false,
			previewTemplate: '',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=utf-8'
			},
			chunksUploaded: async (file, done) => {
				if (!file.upload?.uuid) return;
				const response = await fetch('/api/upload', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json;charset=utf-8',
						Authorization: token.value ? `Bearer ${token.value}` : ''
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

				const reply = await response.json();
				uploadsStore.setCompleted(file.upload.uuid, reply.files[0].url);
				done();
			},
			addedfile: file => {
				if (!file.upload) return;

				uploadsStore.addFile({
					uuid: file.upload.uuid,
					name: file.name,
					type: file.type,
					processing: true,
					status: 'uploading',
					bytesSent: 0,
					bytesTotal: file.size,
					progress: 0,
					url: ''
				});

				console.log(file);
			},
			uploadprogress: (file, progress, bytesSent) => {
				if (!file.upload) return;
				uploadsStore.updateProgess(file.upload.uuid, progress, bytesSent);
				console.log(file, progress);
			},
			// @ts-ignore
			success: (file, data) => {
				if (!file.upload) return;
				// TODO: Error handling
				if (!data.files?.length) return;

				uploadsStore.setCompleted(file.upload.uuid, data.files[0].url);
				console.log(file);
			},
			error: (file, message) => {
				if (!file.upload) return;
				const error = message as ApiError;
				uploadsStore.setError(file.upload.uuid, error.message);
				console.log(file, message);
			}
		});

		drop.options.headers = {
			Authorization: token.value ? `Bearer ${token.value}` : ''
		};
	}
});
</script>
