<template>
	<div class="flex">
		<pre><code class="hljs text-right !pr-0"><div v-for="line in lines" :key="line">{{ line }}</div></code></pre>
		<!-- eslint-disable-next-line vue/no-v-html -->
		<pre class="grow"><code class="h-full" :class="className" v-html="code"></code></pre>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import 'highlight.js/styles/github-dark.css';
import hljs from 'highlight.js/lib/core';

const props = defineProps<{
	language: string;
	code: string;
}>();

const className = computed(() => `hljs ${props.language}`);

const code = computed(() => {
	return hljs.highlight(props.code, { language: props.language }).value;
});

const lines = computed(() => {
	return code.value.split('\n').length;
});
</script>
