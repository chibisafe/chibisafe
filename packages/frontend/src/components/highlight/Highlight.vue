<template>
	<div class="flex" :class="[isPreview ? 'overflow-hidden' : 'overflow-auto']">
		<pre
			class="select-none"
		><code class="hljs text-right !pr-0"><div v-for="line in lines" :key="line">{{ line }}</div></code></pre>
		<!-- eslint-disable-next-line vue/no-v-html -->
		<pre class="grow"><code class="h-full" :class="className" v-html="code"></code></pre>
	</div>
</template>

<script setup lang="ts">
import hljs from 'highlight.js/lib/core';
import { computed } from 'vue';
import 'highlight.js/styles/github-dark.css';

const props = defineProps<{
	language: string;
	code: string;
	isPreview?: boolean;
}>();

const className = computed(() => `hljs ${props.language}`);

const code = computed(() => {
	return hljs.highlight(props.code, { language: props.language }).value;
});

const lines = computed(() => {
	return code.value.split('\n').length;
});
</script>
