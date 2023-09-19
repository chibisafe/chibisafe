<template>
	<div
		class="text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 rounded-full bg-white text-gray-700 border mr-4 w-fit"
	>
		<svg class="h-2 w-2 mr-2 cursor-pointer" stroke="currentColor" fill="none" viewBox="0 0 8 8">
			<path stroke-linecap="round" stroke-width="1.5" d="M1 1l6 6m0-6L1 7" />
		</svg>
		{{ text }}
	</div>
</template>

<script setup lang="ts">
defineProps({
	text: {
		type: String,
		required: true
	}
});
</script>
