<template>
	<div>
		<label class="block text-sm font-mediumtext-light-100">{{ label }}</label>
		<div class="mt-1">
			<input
				class="shadow-md focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-700 rounded-sm text-light-100 bg-dark-110"
				:class="[blur ? 'blur-sm hover:blur-none' : '']"
				:type="type"
				:placeholder="placeholder"
				:value="modelValue"
				@input="updateValue"
			/>
		</div>
		<p v-if="notice" class="bg-red-700 p-2 mt-2 text-sm text-white italic rounded-sm">Notice: {{ notice }}</p>
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
	},
	notice: {
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
