<template>
	<ScrollArea class="h-screen">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
			<h1 class="text-2xl mt-8 font-semibold text-light-100">
				{{ albumInfo?.name }} ({{ albumInfo?.count }} files)
			</h1>

			<h2 v-if="albumInfo?.description" class="text-xl mt-4 text-light-100">
				{{ albumInfo?.description }}
			</h2>

			<div v-if="albumInfo?.isNsfw && !enableNsfw" class="text-light-100 w-full flex flex-col mt-24 text-center">
				<h2>This album is NSFW, to view the contents click on the button below</h2>
				<Button variant="primary" class="mt-8" @click="enableNsfw = true">Show content</Button>
			</div>
			<template v-else>
				<FilesWrapper type="publicAlbum" :identifier="identifier" />
				<!-- EMIT AN EVENT ON THE FILESWRAPPER WITH THE ALBUM INFO -->
			</template>
		</div>
	</ScrollArea>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAlbumsStore } from '@/store';
import Button from '~/components/buttons/Button.vue';
import FilesWrapper from '~/components/wrappers/FilesWrapper.vue';

defineProps<{
	identifier: string;
}>();

const albumStore = useAlbumsStore();
const albumInfo = computed(() => albumStore.publicAlbumInfo);

const enableNsfw = ref(false);
</script>
