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
						name,
						href: '/dashboard/tags/' + props.uuid
					}
				]"
			/>
			<h1 class="text-2xl mt-8 font-semibold text-light-100">`{{ name }}` uploads</h1>
			<FilesWrapper type="tag" :tagUuid="uuid" :callback="onLoaded" />
		</div>
	</ScrollArea>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs.vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import FilesWrapper from '@/components/wrappers/FilesWrapper.vue';

const props = defineProps<{
	uuid: string;
}>();

const name = ref('');
const onLoaded = (data: string) => {
	name.value = data;
};
</script>
