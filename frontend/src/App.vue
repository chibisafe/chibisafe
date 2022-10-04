<template>
	<metainfo>
		<template #title="{ content }">
			{{ content ? `${content} | chibisafe` : `chibisafe` }}
		</template>
	</metainfo>
	<div class="flex flex-col flex-1 h-full relative">
		<router-view />
	</div>
</template>

<script setup lang="ts">
import { useMeta } from 'vue-meta';

// Override meta data
useMeta({
	title: '',
	htmlAttrs: {
		lang: 'en',
		amp: false
	}
});
</script>
