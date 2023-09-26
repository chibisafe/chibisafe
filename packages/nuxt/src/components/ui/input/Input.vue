<template>
	<div>
		<label v-if="label" class="block text-theme-1000 dark:text-theme-100 mb-1">{{ label }}</label>
		<input
			class="rounded-md bg-theme-100 dark:bg-theme-500 border-theme-400 px-3 py-2 shadow-sm block w-full border-1 p-0 text-theme-1000 dark:text-theme-100 placeholder-gray-500 focus:ring-0 sm:text-sm truncate"
			:type="type"
			:placeholder="placeholder"
			:value="modelValue"
			@input="updateValue"
		/>
	</div>
</template>

<script setup lang="ts">
defineProps({
	modelValue: {
		type: [String, Number],
		default: ''
	},
	label: {
		type: String,
		default: ''
	},
	placeholder: {
		type: String,
		default: ''
	},
	type: {
		type: String,
		default: 'text'
	}
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (event: any) => {
	emit('update:modelValue', event.target.value);
};
</script>
