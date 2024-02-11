<template>
	<template v-if="isUploadEnabled">
		<input
			v-model="url"
			type="text"
			class="w-full h-12 rounded-md bg-[#181a1b] border-4 shadow-lg border-[#303436] p-4 text-light-100"
			placeholder="Paste URL you want to fetch here"
		/>
		<button
			type="button"
			class="w-full h-12 rounded-md bg-[#2a4a5a] border-4 shadow-lg border-[#303436]"
			@click="fetchRequest"
		>
			<div class="flex items-center justify-center h-full">
				<Download class="w-6 h-6" />
				FETCH
			</div>
		</button>
	</template>
	<template v-else>
		<div class="flex flex-row items-center justify-center h-full bg-[#181a1b]">
			<div class="text-center">
				<Cloud class="w-6 h-6" />
				<p class="mt-4 text-sm text-gray-500">You need to be logged in to upload files links</p>
			</div>
		</div>
	</template>
</template>

<script setup lang="ts">
import { Download, Cloud } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { useUserStore, useSettingsStore } from '~/store';
const userStore = useUserStore();
// const uploadsStore = useUploadsStore();
const settingsStore = useSettingsStore();
const isUploadEnabled = computed(() => {
	if (settingsStore.publicMode) return true;
	return isLoggedIn.value;
});
const token = computed(() => userStore.user.token);
const isLoggedIn = computed(() => userStore.user.loggedIn);
const url = ref('');
const fetchRequest = async () => {
	console.log(url.value);

	// post to upload/url with { url: url.value }

	const result = fetch('/api/upload/url', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			authorization: token.value ? `Bearer ${token.value}` : ''
		},
		body: JSON.stringify({ url: url.value })
	});

	await result.then(res => {
		console.log(res);
	});
};
</script>
