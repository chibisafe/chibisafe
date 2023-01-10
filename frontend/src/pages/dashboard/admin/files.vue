<template>
	<Sidebar>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-screen overflow-auto">
			<Breadcrumbs
				:pages="[
					{
						name: 'Admin',
						href: '/dashboard/admin/files'
					},
					{
						name: 'Files',
						href: '/dashboard/admin/files'
					}
				]"
			/>
			<h1 class="text-2xl mt-8 font-semibold text-light-100">All uploads ({{ totalFiles }} files)</h1>
			<Masonry type="admin" />
		</div>
	</Sidebar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFilesStore } from '~/store/files';
import Sidebar from '~/components/sidebar/Sidebar.vue';
import Masonry from '~/components/masonry/Masonry.vue';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';

const filesStore = useFilesStore();
const totalFiles = computed(() => filesStore.count);

void filesStore.getAdmin();
</script>
