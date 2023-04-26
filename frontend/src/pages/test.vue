<template>
	<div id="test"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import Tus from '@uppy/tus';
// import ProgressBar from '@uppy/progress-bar';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
// import '@uppy/progress-bar/dist/style.min.css';

onMounted(() => {
	new Uppy({
		autoProceed: true,
		restrictions: {
			maxFileSize: 100 * 1e6, // 100MB,
			allowedFileTypes: ['image/*', 'video/*']
		}
	})
		.use(Dashboard, {
			inline: true,
			target: '#test',
			theme: 'dark'
		})
		.use(Tus, { endpoint: '/api/upload' })
		.on('complete', result => {
			console.log('Upload result:', result);
		});
});
</script>
