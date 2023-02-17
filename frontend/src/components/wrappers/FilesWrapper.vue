<template>
	<div class="my-4 bg-dark-90 h-14 px-2 flex items-center">
		<button type="button" class="bg-dark-80 text-light-100 p-2 h-10 mr-2" @click="toggleMasonry">
			Toggle view
		</button>
		<button type="button" class="bg-dark-80 text-light-100 p-2 h-10" @click="nothing">Bulk operations</button>
		<!-- Pagination -->
		<div class="flex-grow" />
		<span class="text-dark-80 dark:text-light-100">{{ totalFiles }} files</span>
		<div class="flex-grow" />
		<Pagination :type="type" />
	</div>

	<Masonry v-if="preferMasonry" :type="type" />
	<FilesTable v-else :type="type" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Masonry from '~/components/masonry/Masonry.vue';
import FilesTable from '~/components/table/FilesTable.vue';
import Pagination from '~/components/pagination/Pagination.vue';
import { useUserStore } from '~/store/user';
import { useFilesStore } from '~/store/files';
import { useAlbumsStore } from '~/store/albums';

const props = defineProps<{
	type: 'admin' | 'album' | 'uploads';
}>();

const userStore = useUserStore();
const filesStore = useFilesStore();
const albumsStore = useAlbumsStore();

const totalFiles = computed(() => {
	if (props.type === 'admin') return filesStore.adminCount;
	else if (props.type === 'album') return albumsStore.count;
	else if (props.type === 'uploads') return filesStore.count;
	return 0;
});

const preferMasonry = computed(() => userStore.preferences.preferMasonry);
const toggleMasonry = () => {
	userStore.preferences.preferMasonry = !userStore.preferences.preferMasonry;
	userStore.savePreferences();
};

const nothing = () => {};
</script>
