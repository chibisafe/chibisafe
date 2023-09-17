<template>
	<div class="relative rounded-md bg-dark-100 border border-dark-80 px-3 py-2 shadow-sm">
		<label
			class="absolute -top-2 left-2 -mt-px pointer-events-none inline-block bg-dark-100 px-1 text-xs font-medium text-light-100"
			>{{ label }}</label
		>

		<a
			v-if="type === 'link'"
			class="block w-full border-0 p-0 text-blue-400 hover:text-blue-500 placeholder-gray-500 focus:ring-0 sm:text-sm bg-dark-100 truncate"
			rel="noopener noreferrer"
			target="_blank"
			:title="href ?? value"
			:href="href ?? value"
			>{{ value }}</a
		>

		<input
			v-else
			:type="type"
			class="block w-full border-0 p-0 text-light-100 placeholder-gray-500 focus:ring-0 sm:text-sm bg-dark-100 truncate"
			:class="[blur ? 'blur-sm hover:blur-none' : '']"
			:value="value ? value : modelValue"
			:readonly="readOnly"
			:placeholder="placeholder"
			@input="updateValue"
		/>
	</div>
</template>

<script setup lang="ts">
defineProps({
	label: {
		type: String,
		default: 'change-me'
	},
	modelValue: {
		type: String,
		default: ''
	},
	value: {
		type: String,
		default: ''
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
		default: 'text'
	},
	href: {
		type: String,
		default: ''
	},
	blur: {
		type: Boolean
	}
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (event: any) => {
	emit('update:modelValue', event.target.value);
};
</script>
