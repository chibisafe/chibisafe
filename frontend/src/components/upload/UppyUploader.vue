<template>
	<div
		id="upload"
		class="absolute w-80 h-80 max-h-[320px] max-w-[320px] right-0 top-0 bg-[#181a1b] rounded-3xl border-4 shadow-lg border-[#303436] flex items-center justify-center blueprint flex-col cursor-pointer hover:border-[#3b3e40] transform-gpu transition-all"
	>
		<IconUpload class="h-12 w-12 pointer-events-none" />
		<h3 class="font-bold text-center mt-4 pointer-events-none">
			DROP FILES OR <br /><span class="text-blue-400">CLICK HERE</span>
		</h3>
		<p class="text-center mt-4 w-3/4 pointer-events-none mb-4">Drag and drop your files here. 5GB max per file.</p>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useUserStore } from '~/store/user';
import { useUploadsStore } from '~/store/uploads';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';
import DragDrop from '@uppy/drag-drop';
import '@uppy/core/dist/style.min.css';

// @ts-ignore
import IconUpload from '~icons/carbon/cloud-upload';

const userStore = useUserStore();
const uploadsStore = useUploadsStore();
const isLoggedIn = computed(() => userStore.user.loggedIn);
const token = computed(() => userStore.user.token);

const initUppy = () => {
	const uppy = new Uppy({
		autoProceed: true,
		restrictions: {
			// TODO: Give it a sane value
			maxFileSize: 10000 * 1e6 // 100MB,
		}
	})
		.use(DragDrop, {
			id: 'upload',
			target: '#upload',
			width: 320,
			height: 320
		})
		.use(Tus, {
			endpoint: '/api/tus',
			chunkSize: 100 * 1e6, // 50MB
			headers: {
				authorization: token.value ? `Bearer ${token.value}` : ''
				// albumuuid: 'test'
			}
		})
		.on('file-added', file => {
			console.log('Added file', file);
			if (!file) return;

			uploadsStore.addFile({
				uuid: file.id,
				name: file.name,
				type: file.type as string,
				processing: true,
				status: 'uploading',
				bytesSent: 0,
				bytesTotal: file.size,
				progress: 0,
				url: ''
			});
		})
		.on('upload-progress', (file, progress) => {
			if (!file) return;
			uploadsStore.updateProgess(
				file.id,
				Math.round((progress.bytesUploaded / progress.bytesTotal) * 100),
				progress.bytesUploaded
			);
			console.log(file.id, progress.bytesUploaded, progress.bytesTotal);
		})
		.on('upload-success', (file, response) => {
			if (!file) return;

			uploadsStore.setCompleted(file.id, 'TODO');
			console.log(file, response);
		})
		.on('upload-error', (file, error, response) => {
			if (!file) return;

			// TODO: Handle error
			uploadsStore.setError(file.id, 'Unexpected error');
		});
};

onMounted(() => {
	initUppy();
});
</script>
