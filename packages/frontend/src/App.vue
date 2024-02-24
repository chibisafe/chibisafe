<template>
	<div
		class="bg-dark-100 fixed top-0 left-0 bg-no-repeat bg-scroll bg-center bg-cover z-[-1] h-screen w-full pointer-events-none"
		:style="`background-image: url(${settingsStore.backgroundImageURL});`"
	></div>
	<div class="flex flex-1 h-full relative" :class="[isInDashboard ? 'flex-row' : 'flex-col']">
		<Sidebar v-if="isInDashboard" />
		<router-view />
		<Toaster />
		<SearchModal />
	</div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { useMagicKeys, whenever } from '@vueuse/core';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Toaster } from 'vue-sonner';
import SearchModal from './components/modals/SearchModal.vue';
import Sidebar from './components/sidebar/Sidebar.vue';
import { useUserStore, useSettingsStore, useModalStore } from './store';

const userStore = useUserStore();
const settingsStore = useSettingsStore();
const modalStore = useModalStore();
const route = useRoute();
const isLoggedIn = computed(() => userStore.user.loggedIn);
const isInDashboard = computed(() => route.path.startsWith('/dashboard'));

void userStore.checkToken();

const { ctrl_k } = useMagicKeys({
	passive: false,
	onEventFired(e) {
		if ((e.ctrlKey || e.metaKey) && e.key === 'k' && e.type === 'keydown') {
			e.preventDefault();
		}
	}
});

whenever(ctrl_k!, () => {
	if (!isLoggedIn.value) return;
	modalStore.search.show = true;
});

// @ts-ignore
if (import.meta.env.DEV) {
	void settingsStore.get();
} else {
	// Since we bake the settings into the HTML, we need to override the store
	const __CHIBISAFE__ = (window as any).__CHIBISAFE__;
	for (const [key, value] of Object.entries(__CHIBISAFE__)) {
		// @ts-ignore
		settingsStore[key] = value;
	}
}

// Override meta data
useHead({
	title: 'Home',
	titleTemplate: (title?: string) => `${title} - ${settingsStore.serviceName}`,
	htmlAttrs: {
		lang: 'en'
	}
});

console.log(
	// @ts-ignore
	// eslint-disable-next-line no-undef
	`%c chibisafe %c v${PACKAGE_VERSION} %c`,
	'background:#35495e; padding: 1px; color: #fff',
	'background:#ff015b; padding: 1px; color: #fff',
	'background:transparent'
);
</script>
