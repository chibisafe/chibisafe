<template>
	<div
		id="test"
		class="absolute w-80 h-80 max-h-[320px] max-w-[320px] right-0 top-0 bg-[#181a1b] rounded-3xl border-4 shadow-lg border-[#303436] flex items-center justify-center blueprint flex-col cursor-pointer hover:border-[#3b3e40] transform-gpu transition-all"
	></div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import Tus from '@uppy/tus';
import { useUserStore } from '~/store/user';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

const userStore = useUserStore();
const token = computed(() => userStore.user.token);

onMounted(() => {
	new Uppy({
		autoProceed: true,
		restrictions: {
			// TODO: Give it a sane value
			maxFileSize: 10000 * 1e6 // 100MB,
		},
		meta: {
			authorization: token.value ? token.value : ''
		}
	})
		.use(Dashboard, {
			inline: true,
			target: '#test',
			theme: 'dark',
			width: 320,
			height: 320,
			showLinkToFileUploadResult: true,
			showProgressDetails: true,
			proudlyDisplayPoweredByUppy: false
		})
		.use(Tus, {
			endpoint: '/api/tus',
			chunkSize: 100 * 1e6 // 50MB
		})
		.on('complete', result => {
			console.log('Upload result:', result);
		});
});
</script>
