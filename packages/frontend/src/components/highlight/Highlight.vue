<template>
	<!-- eslint-disable-next-line vue/no-v-html -->
	<pre><code :class="className" v-html="code"></code></pre>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import 'highlight.js/styles/github-dark.css';
import hljs from 'highlight.js/lib/core';

const props = defineProps<{
	language: string;
	code: string;
}>();

const className = computed(() => `hljs ${props.language} hljs-lines`);

const code = computed(() => {
	const highlightedCode = hljs.highlight(props.language, props.code);
	const lineDigits = String(highlightedCode.value.split('\n').length).length;
	return highlightedCode.value.replaceAll(/^/gm, `<span class="hljs-line w-${lineDigits * 4}"></span>`);
});
</script>
