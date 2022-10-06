<template>
	<metainfo>
		<template #title="{ content }">
			{{ content ? `${content} | chibisafe` : `chibisafe` }}
		</template>
	</metainfo>
	<div class="flex flex-col flex-1 h-full relative">
		<router-view />
		<About />
	</div>
</template>

<script setup lang="ts">
import { useMeta } from 'vue-meta';
import { useUserStore } from './store/user';
import About from '~/components/about/About.vue';

// Check for a valid token and try logging in
const userStore = useUserStore();
userStore.checkToken();

// Override meta data
useMeta({
	title: '',
	htmlAttrs: {
		lang: 'en',
		amp: false
	}
});

console.log(
	`%c chibisafe %c v${PACKAGE_VERSION} %c`,
	'background:#35495e; padding: 1px; color: #fff',
	'background:#ff015b; padding: 1px; color: #fff',
	'background:transparent'
);
</script>
