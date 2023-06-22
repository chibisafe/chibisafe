<template>
	<div class="my-4 bg-dark-90 h-14 mobile:h-auto px-2 mobile:py-2 flex items-center mobile:flex-wrap">
		<button type="button" class="bg-dark-80 text-light-100 p-2 h-10 mr-2" @click="toggleMasonry">
			Toggle view
		</button>
		<button type="button" class="bg-dark-80 text-light-100 p-2 h-10" @click="nothing">Bulk actions</button>
		<!-- Pagination -->
		<div class="flex-grow" />
		<span class="text-dark-80 dark:text-light-100">{{ totalFiles }} files</span>
		<div class="desktop:flex-grow mobile:basis-full mobile:h-2" />
		<Pagination :type="type" class="mobile:basis-full" />
	</div>

	<Masonry v-if="preferMasonry" :type="type" />
	<FilesTable v-else :type="type" />

	<div class="my-4 bg-dark-90 h-14 mobile:h-auto px-2 mobile:py-2 flex items-center mobile:flex-wrap mobile:mb-20">
		<button type="button" class="bg-dark-80 text-light-100 p-2 h-10 mr-2" @click="toggleMasonry">
			Toggle view
		</button>
		<button type="button" class="bg-dark-80 text-light-100 p-2 h-10" @click="nothing">Bulk actions</button>
		<!-- Pagination -->
		<div class="flex-grow" />
		<span class="text-dark-80 dark:text-light-100">{{ totalFiles }} files</span>
		<div class="desktop:flex-grow mobile:basis-full mobile:h-2" />
		<Pagination :type="type" class="mobile:basis-full" />
	</div>
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
	if (props.type === 'album') return albumsStore.count;
	else return filesStore.count;
});

const preferMasonry = computed(() => userStore.preferences.preferMasonry);
const toggleMasonry = () => {
	userStore.preferences.preferMasonry = !userStore.preferences.preferMasonry;
	userStore.savePreferences();
};

const nothing = () => {};
</script>
