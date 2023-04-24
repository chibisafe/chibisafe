<template>
	<div class="flex items-center">
		<span class="text-dark-80 dark:text-light-100 mr-4">Page {{ page }} of {{ Math.ceil(total / 50) }}</span>
		<button
			:disabled="isFirstPage"
			type="button"
			:class="[isFirstPage ? 'cursor-not-allowed bg-dark-90' : 'bg-dark-80']"
			class="text-light-100 p-2 h-10 mr-2"
			@click="previousPage"
		>
			Previous
		</button>
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
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFilesStore } from '~/store/files';
import { useAlbumsStore } from '~/store/albums';

const props = defineProps<{
	type: 'admin' | 'album' | 'uploads';
}>();

const route = useRoute();
const router = useRouter();
const queryPage = ref(route.query.page);

const filesStore = useFilesStore();
const albumsStore = useAlbumsStore();

const page = computed(() => {
	if (props.type === 'admin') return filesStore.adminCurrentPage;
	else if (props.type === 'album') return albumsStore.currentPage;
	else if (props.type === 'uploads') return filesStore.currentPage;
	return 1;
});

const total = computed(() => {
	if (props.type === 'admin') return filesStore.adminCount;
	else if (props.type === 'album') return albumsStore.count;
	else if (props.type === 'uploads') return filesStore.count;
	return 1;
});

const isFirstPage = computed(() => {
	if (props.type === 'admin') return filesStore.adminCurrentPage === 1;
	else if (props.type === 'album') return albumsStore.currentPage === 1;
	else if (props.type === 'uploads') return filesStore.currentPage === 1;
	return true;
});

const isLastPage = computed(() => {
	if (props.type === 'admin') return filesStore.adminCurrentPage === Math.ceil(filesStore.adminCount / 50);
	else if (props.type === 'album') return albumsStore.currentPage === Math.ceil(albumsStore.count / 50);
	else if (props.type === 'uploads') return filesStore.currentPage === Math.ceil(filesStore.count / 50);
	return true;
});

const previousPage = async () => {
	if (props.type === 'admin') await filesStore.getPreviousPageAdmin();
	else if (props.type === 'album') await albumsStore.getPreviousPage();
	else if (props.type === 'uploads') await filesStore.getPreviousPage();
	const query = { ...route.query };
	if (page.value === 1) delete query.page;
	await router.replace({ query });
};

const nextPage = async () => {
	if (props.type === 'admin') await filesStore.getNextPageAdmin();
	else if (props.type === 'album') await albumsStore.getNextPage();
	else if (props.type === 'uploads') await filesStore.getNextPage();
	await router.replace({ query: { page: page.value } });
};
</script>
