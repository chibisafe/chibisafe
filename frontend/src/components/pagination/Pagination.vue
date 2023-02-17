<template>
	<div class="flex items-center">
		<span class="text-dark-80 dark:text-light-100 mr-4">Page {{ page }} of {{ Math.ceil(total / 50) }}</span>
		<button type="button" class="bg-dark-80 text-light-100 p-2 h-10 mr-2" @click="previousPage">Previous</button>
		<button type="button" class="bg-dark-80 text-light-100 p-2 h-10" @click="nextPage">Next</button>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFilesStore } from '~/store/files';
import { useAlbumsStore } from '~/store/albums';

const props = defineProps<{
	type: 'admin' | 'album' | 'uploads';
}>();

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
};

const nextPage = async () => {
	if (isLastPage.value) return;
	if (props.type === 'admin') await filesStore.getNextPageAdmin();
	else if (props.type === 'album') await albumsStore.getNextPage();
	else if (props.type === 'uploads') await filesStore.getNextPage();
};
</script>
