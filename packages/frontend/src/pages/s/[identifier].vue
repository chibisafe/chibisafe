<template>
	<div class="bg-[#0d1117] w-full h-full">
		<Highlight v-if="snippet" :language="snippet.language" :code="snippet.content" />
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getPublicSnippet } from '~/use/api';
import type { Snippet } from '~/types';
import Highlight from '~/components/highlight/Highlight.vue';

const props = defineProps<{
	identifier: string;
}>();

const snippet = ref<Snippet>();

onMounted(async () => {
	snippet.value = await getPublicSnippet(props.identifier);
});
</script>
