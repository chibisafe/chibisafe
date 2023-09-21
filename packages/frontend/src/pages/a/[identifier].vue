<template>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
		<h1 class="text-2xl mt-8 font-semibold text-light-100">{{ data?.name }} ({{ data?.count }} files)</h1>
		<div v-if="data?.isNsfw && !enableNsfw" class="text-light-100 w-full flex flex-col mt-24 text-center">
			<h2>This album is NSFW, to view the contents click on the button below</h2>
			<Button variant="primary" class="mt-8" @click="enableNsfw = true">Show content</Button>
		</div>
		<template v-else>
			<FilesWrapper type="publicAlbum" :identifier="identifier" />
		</template>
	</div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { computed, ref } from 'vue';
import { getFilesFromPublicAlbum } from '@/use/api';
import Button from '~/components/buttons/Button.vue';
import FilesWrapper from '~/components/wrappers/FilesWrapper.vue';

const props = defineProps<{
	identifier: string;
}>();

const id = computed(() => props.identifier);

const { data } = useQuery({
	queryKey: ['publicAlbum', id],
	queryFn: () => getFilesFromPublicAlbum(id.value, 1, 1),
	keepPreviousData: true
});

const enableNsfw = ref(false);
</script>
