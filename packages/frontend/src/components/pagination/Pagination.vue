<template>
	<div class="flex items-center mobile:justify-center">
		<span class="text-dark-80 dark:text-light-100 mr-4 mobile:hidden"
			>Page {{ page }} of {{ Math.ceil(total / 50) }}</span
		>
		<span class="text-dark-80 dark:text-light-100 mr-4 desktop:hidden"
			>{{ page }} / {{ Math.ceil(total / 50) }}</span
		>
		<button
			:disabled="isFirstPage"
			type="button"
			:class="[isFirstPage ? 'cursor-not-allowed bg-dark-90' : 'bg-dark-80']"
			class="text-light-100 p-2 h-10 mr-2"
			@click="previousPage"
		>
			Previous
		</button>
		<select :value="page" class="bg-dark-80 text-light-100 h-10 mr-2" @change="goToPage">
			<option v-for="index in totalPages" :key="index" :value="index">{{ index }}</option>
		</select>
		<button
			:disabled="isLastPage"
			type="button"
			:class="[isLastPage ? 'cursor-not-allowed bg-dark-90' : 'bg-dark-80']"
			class="text-light-100 p-2 h-10"
			@click="nextPage"
		>
			Next
		</button>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFilesStore } from '~/store/files';
import { useAlbumsStore } from '~/store/albums';

const props = defineProps<{
	type: 'admin' | 'album' | 'uploads';
}>();

const route = useRoute();
const router = useRouter();

const filesStore = useFilesStore();
const albumsStore = useAlbumsStore();

const page = computed(() => {
	if (props.type === 'album') return albumsStore.currentPage;
	else return filesStore.currentPage;
});

const total = computed(() => {
	if (props.type === 'album') return albumsStore.count;
	else return filesStore.count;
});

const totalPages = computed(() => {
	if (props.type === 'album') return Math.ceil(albumsStore.count / 50);
	else return Math.ceil(filesStore.count / 50);
});

const isFirstPage = computed(() => {
	if (props.type === 'album') return albumsStore.currentPage === 1;
	else return filesStore.currentPage === 1;
});

const isLastPage = computed(() => {
	if (props.type === 'album') return albumsStore.currentPage === totalPages.value;
	else return filesStore.currentPage === totalPages.value;
});

const previousPage = async () => {
	if (props.type === 'album') await albumsStore.getPreviousPage();
	else await filesStore.getPreviousPage();

	const query = { ...route.query };
	if (page.value === 1) {
		delete query.page;
	} else {
		query.page = String(page.value);
	}

	await router.replace({ query });
};

const nextPage = async () => {
	if (props.type === 'album') await albumsStore.getNextPage();
	else await filesStore.getNextPage();

	const query = { ...route.query };
	query.page = String(page.value);
	await router.replace({ query });
};

const goToPage = async (event: Event) => {
	if (!event.target) return;
	const target = event.target as HTMLSelectElement;
	const pageNum = Number(target.value);

	if (props.type === 'album') await albumsStore.goToPage(pageNum);
	else await filesStore.goToPage(pageNum);

	const query = { ...route.query };
	if (pageNum === 1) delete query.page;
	else query.page = String(pageNum);
	await router.replace({ query });
};
</script>
