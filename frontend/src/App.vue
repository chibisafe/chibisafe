<template>
	<metainfo>
		<template #title="{ content }">
			{{ content ? `${content} | chibisafe` : `chibisafe` }}
		</template>
	</metainfo>
	<div class="flex flex-col flex-1 h-full relative">
		<router-view />
		<About />
		<Toast />
	</div>
</template>

<script setup lang="ts">
import { useMeta } from 'vue-meta';
import { useUserStore } from './store/user';
import { useRoute } from 'vue-router';
import About from '~/components/about/About.vue';
import Toast from './components/toast/Toast.vue';

const route = useRoute();
if (!route.path.startsWith('/a/')) {
	// Check for a valid token and try logging in unless we're on the /a/ route
	// The reason is that /a/ is public and we don't need auth
	const userStore = useUserStore();
	userStore.checkToken();
}

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
