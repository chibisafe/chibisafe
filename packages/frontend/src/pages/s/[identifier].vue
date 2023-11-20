<template>
	<div class="bg-[#0d1117] w-full h-full relative overflow-auto">
		<div class="absolute top-2 right-2 overflow-auto">
			<button
				type="button"
				class="inline-flex justify-center rounded-md bg-dark-90 px-4 py-2 font-medium text-white shadow-sm hover:bg-green-800 focus:outline-none focus:ring-0 focus:ring-red-500 focus:ring-offset-2 ml-2 w-auto text-sm"
				@click="copyCode"
			>
				Copy
			</button>
			<a
				:href="`/api/snippet/${props.identifier}/raw`"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex justify-center rounded-md bg-dark-90 px-4 py-2 font-medium text-white shadow-sm hover:bg-green-800 focus:outline-none focus:ring-0 focus:ring-red-500 focus:ring-offset-2 ml-2 w-auto text-sm"
			>
				Open raw
			</a>
		</div>
		<Highlight v-if="snippet" :language="snippet.language" :code="snippet.content" />
	</div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { onMounted, ref } from 'vue';
import Highlight from '~/components/highlight/Highlight.vue';
import type { Snippet } from '~/types';
import { getPublicSnippet } from '~/use/api';

const props = defineProps<{
	identifier: string;
}>();

const snippet = ref<Snippet>();
const { copy } = useClipboard();

const copyCode = () => {
	if (!snippet.value) return;
	void copy(snippet.value?.content);
};

onMounted(async () => {
	snippet.value = await getPublicSnippet(props.identifier);
});
</script>
