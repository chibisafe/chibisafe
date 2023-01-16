<template>
	<Sidebar>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-screen overflow-auto">
			<Breadcrumbs
				:pages="[
					{
						name: 'Uploads',
						href: '/dashboard/uploads'
					}
				]"
			/>
			<h1 class="text-2xl mt-8 font-semibold text-light-100">Uploads ({{ totalFiles }} files)</h1>
			<button type="button" class="border text-light-100 p-2" @click="showMasonry = !showMasonry">
				Toggle list/masonry
			</button>
			<Masonry v-if="showMasonry" type="uploads" />
			<FilesTable v-else type="uploads" />
		</div>
	</Sidebar>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useFilesStore } from '~/store/files';
import Sidebar from '~/components/sidebar/Sidebar.vue';
import Masonry from '~/components/masonry/Masonry.vue';
import FilesTable from '~/components/table/FilesTable.vue';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';

const filesStore = useFilesStore();
const totalFiles = computed(() => filesStore.count);

const showMasonry = ref(true);
void filesStore.get();
</script>
