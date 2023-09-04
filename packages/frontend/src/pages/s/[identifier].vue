<template>
	<div class="bg-[#0d1117] w-full h-full">
		<component
			:is="hljsVuePlugin.component"
			v-if="snippet"
			:language="snippet.language"
			:code="snippet.content"
			class="h-full"
		/>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getPublicSnippet } from '~/use/api';
import type { Snippet } from '~/types';
import 'highlight.js/styles/github-dark.css';
import hljsVuePlugin from '@highlightjs/vue-plugin';

const props = defineProps<{
	identifier: string;
}>();

const snippet = ref<Snippet>();

onMounted(async () => {
	snippet.value = await getPublicSnippet(props.identifier);
});
</script>
