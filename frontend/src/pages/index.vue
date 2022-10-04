<template>
	<div class="flex flex-col justify-center items-center h-full w-[400px] self-center dark:text-chibisafe-text-light">
		chibisafe

		<div ref="dropzone" class="dropzone"></div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Dropzone from 'dropzone';

const dropzone = ref<HTMLDivElement>();

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
