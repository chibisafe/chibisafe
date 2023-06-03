<template>
	<metainfo>
		<template #title="{ content }">
			{{ content ? `${content} | chibisafe` : `chibisafe` }}
		</template>
	</metainfo>
	<div class="flex flex-col flex-1 h-full relative">
		<router-view />
		<Toast />
	</div>
</template>

<script setup lang="ts">
import { useMeta } from 'vue-meta';
import { useUserStore, useSettingsStore } from './store';
import Toast from './components/toast/Toast.vue';

const userStore = useUserStore();
const settingsStore = useSettingsStore();
userStore.checkToken();
void settingsStore.get();

// Override meta data
useMeta({
	title: '',
	htmlAttrs: {
		lang: 'en',
		amp: false
	}
});

console.log(
	// @ts-ignore
	`%c chibisafe %c v${PACKAGE_VERSION} %c`,
	'background:#35495e; padding: 1px; color: #fff',
	'background:#ff015b; padding: 1px; color: #fff',
	'background:transparent'
);
</script>
