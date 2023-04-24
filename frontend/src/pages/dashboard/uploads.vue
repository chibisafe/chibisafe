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
			<h1 class="text-2xl mt-8 font-semibold text-light-100">Uploads</h1>
			<FilesWrapper type="uploads" />
		</div>
	</Sidebar>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useFilesStore } from '~/store/files';
import Sidebar from '~/components/sidebar/Sidebar.vue';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';
import FilesWrapper from '~/components/wrappers/FilesWrapper.vue';

const route = useRoute();
const filesStore = useFilesStore();

const checkRouteQuery = () => {
	if (route.query.page) {
		const pageNum = Number(route.query.page);
		if (!Number.isNaN(pageNum)) {
			void filesStore.get(pageNum);
			return;
		}

		void filesStore.get();
	}

	void filesStore.get();
};

checkRouteQuery();
</script>
