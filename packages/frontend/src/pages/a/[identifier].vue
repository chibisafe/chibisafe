<template>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative h-full">
		<h1 class="text-2xl mt-8 font-semibold text-light-100">{{ albumName }} ({{ totalFiles }} files)</h1>
		<div
			v-if="nsfw && !enableNsfw"
			class="text-light-100 absolute top-1/2 left-0 w-full flex flex-col -translate-y-[76px] text-center"
		>
			<h2>This album is NSFW, to view the contents click on the button below</h2>
			<Button variant="primary" class="mt-8" @click="enableNsfw = true">Show content</Button>
		</div>
		<template v-else>
			<div class="my-4 bg-dark-90 h-14 mobile:h-auto px-2 mobile:py-2 flex items-center mobile:flex-wrap">
				<Pagination
					:currentPage="currentPage"
					:count="totalFiles"
					:previousPageFn="getPreviousPage"
					:nextPageFn="getNextPage"
					:goToPageFn="goToPage"
					class="mobile:basis-full"
				/>
			</div>
			<Masonry />
		</template>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from '~/components/buttons/Button.vue';
import Masonry from '~/components/masonry/MasonryPublic.vue';
import { useFilesStore } from '~/store/files';
import { getFilesFromPublicAlbum } from '~/use/api';

const props = defineProps<{
	identifier: string;
}>();

const router = useRouter();
const filesStore = useFilesStore();
const totalFiles = ref(0);
const albumName = ref('');
const nsfw = ref(false);
const enableNsfw = ref(false);
const currentPage = ref(1);

const getPreviousPage = async () => {
	await getFiles(currentPage.value - 1);
};

const getNextPage = async () => {
	await getFiles(currentPage.value + 1);
};

const goToPage = async (pageNumber: number) => {
	await getFiles(pageNumber);
};

const getFiles = async (page = 1) => {
	currentPage.value = page;
	const response = await getFilesFromPublicAlbum(props.identifier, currentPage.value);
	if (!response) {
		// If the album doesn't exist, redirect to the home page
		await router.replace('/');
		return;
	}

	totalFiles.value = response.count;
	albumName.value = response.name;
	filesStore.files = response.files;
	nsfw.value = response.isNsfw;
};

onMounted(async () => {
	void getFiles();
});
</script>
