<template>
	<ScrollArea class="w-full">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
	</ScrollArea>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { ScrollArea } from '@/components/ui/scroll-area';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';
import FilesWrapper from '~/components/wrappers/FilesWrapper.vue';

const route = useRoute();

const processRouteQuery = () => {
	const searchTerm = route.query.search;
	const pageNum = Number(route.query.page);

	const objToPass: Record<string, unknown> = {};
	if (searchTerm) {
		objToPass.searchTerm = String(searchTerm);
	}

	if (pageNum && !Number.isNaN(pageNum)) {
		objToPass.page = pageNum;
	}
};

processRouteQuery();

watch(
	() => route.query.search,
	() => {
		processRouteQuery();
	}
);
</script>
