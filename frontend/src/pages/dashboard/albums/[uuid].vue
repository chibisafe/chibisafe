<template>
	<Sidebar>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-screen overflow-auto">
			<Breadcrumbs
				:pages="[
					{
						name: 'Albums',
						href: '/dashboard/albums'
					},
					{
						name: albumName,
						href: '/dashboard/albums/' + props.uuid
					}
				]"
			/>
			<h1 class="text-2xl mt-8 font-semibold text-light-100">`{{ albumName }}` uploads</h1>
			<FilesWrapper type="album" />
		</div>
	</Sidebar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAlbumsStore } from '~/store/albums';
import Sidebar from '~/components/sidebar/Sidebar.vue';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';
import FilesWrapper from '~/components/wrappers/FilesWrapper.vue';

const props = defineProps<{
	uuid: string;
}>();

const albumsStore = useAlbumsStore();
const albumName = computed(() => albumsStore.album?.name ?? '');

void albumsStore.getAlbum(props.uuid);
</script>
