<script setup lang="ts">
import { cn } from '@/lib/utils';

const props = defineProps<{ class?: string }>();
</script>

<template>
	<div class="w-full max-w-[calc(100vw-15rem)] overflow-auto mobile:max-w-[calc(100vw-2rem)]">
		<table :class="cn('w-full caption-bottom text-sm', props.class)">
			<slot />
		</table>
	</div>
</template>
