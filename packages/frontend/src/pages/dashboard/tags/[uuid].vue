<template>
	<ScrollArea class="w-full">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<Breadcrumbs
				:pages="[
					{
						name: 'Tags',
						href: '/dashboard/tags'
					},
					{
						name: 'tagName',
						href: '/dashboard/tags/' + props.uuid
					}
				]"
			/>
			<h1 class="text-2xl mt-8 font-semibold text-light-100">`tagName` uploads</h1>
			<FilesWrapper type="tag" :tagUuid="uuid" />
		</div>
	</ScrollArea>
</template>

<script setup lang="ts">
// import { computed } from 'vue';
// import { useRoute } from 'vue-router';
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs.vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import FilesWrapper from '@/components/wrappers/FilesWrapper.vue';
// import { useAlbumsStore } from '@/store/albums';

const props = defineProps<{
	uuid: string;
}>();

// const route = useRoute();
// const albumsStore = useAlbumsStore();
// const tagName = computed(() => albumsStore.album?.name ?? '');

// const checkRouteQuery = () => {
// 	if (route.query.page) {
// 		const pageNum = Number(route.query.page);
// 		if (!Number.isNaN(pageNum)) {
// 			void albumsStore.getAlbum(props.uuid, pageNum);
// 			return;
// 		}

// 		void albumsStore.getAlbum(props.uuid);
// 	}

// 	void albumsStore.getAlbum(props.uuid);
// };

// checkRouteQuery();
</script>
