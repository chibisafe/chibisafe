<template>
	<div class="relative rounded-md dark:bg-dark-100 border px-3 py-2 shadow-sm">
		<label
			class="absolute -top-2 left-2 -mt-px pointer-events-none inline-block bg-white dark:bg-dark-100 px-1 text-xs font-medium text-gray-900 dark:text-light-100"
			>{{ props.label }}</label
		>

		<a
			v-if="props.type === 'link'"
			class="block w-full border-0 p-0 text-blue-400 placeholder-gray-500 focus:ring-0 sm:text-sm dark:bg-dark-100"
			rel="noopener noreferrer"
			target="_blank"
			:href="props.value"
			>{{ props.value }}</a
		>

		<input
			v-else
			type="text"
			class="block w-full border-0 p-0 text-gray-900 dark:text-light-100 placeholder-gray-500 focus:ring-0 sm:text-sm dark:bg-dark-100"
			:value="props.value"
			:readonly="props.readOnly"
			:placeholder="props.placeholder"
		/>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	label: {
		type: String,
		default: 'change-me'
	},
	value: {
		type: String,
		default: 'change-me'
	},
	readOnly: {
		type: Boolean
	},
	placeholder: {
		type: String,
		default: ''
	},
	type: {
		type: String,
		default: ''
	}
});
</script>
