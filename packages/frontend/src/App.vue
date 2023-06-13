<template>
	<metainfo>
		<template #title="{ content }">
			{{ content ? `${content} | ${settingsStore.serviceName}` : settingsStore.serviceName }}
		</template>
	</metainfo>

	<div
		v-if="userStore.user?.id === 1 && !userStore.user.passwordEditedAt"
		class="w-full p-6 flex justify-center items-center text-light-100 bg-red-900"
	>
		It seems you are using the admin account but haven't changed the default password yet. Go to the dashboard and
		change it.
	</div>
	<div
		class="bg-dark-100 fixed top-0 left-0 bg-no-repeat bg-scroll bg-center bg-cover z-[-1] h-screen w-full pointer-events-none"
		:style="`background-image: url(${settingsStore.background});`"
	></div>
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

// @ts-expect-error env doesn';t exist, but it does at runtime.
if (import.meta.env.DEV) {
	void settingsStore.get();
} else {
	// Since we bake the settings into the HTML, we need to override the store
	const __CHIBISAFE__ = (window as any).__CHIBISAFE__;
	settingsStore.serviceName = __CHIBISAFE__.serviceName;
	settingsStore.background = __CHIBISAFE__.background;
	settingsStore.chunkSize = __CHIBISAFE__.chunkSize;
	settingsStore.maxFileSize = __CHIBISAFE__.maxFileSize;
	settingsStore.logo = __CHIBISAFE__.logo;
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
