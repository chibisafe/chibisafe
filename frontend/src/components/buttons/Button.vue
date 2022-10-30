<template>
	<button type="button" class="" :class="[getVariant, getAlign, getSize]">
		<slot />
	</button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
	variant: {
		type: String,
		default: 'primary'
	},
	size: {
		type: String,
		default: 'md'
	},
	align: {
		type: String,
		default: 'center'
	}
});

const getVariant = computed(() => {
	if (props.variant === 'link') {
		return 'inline-flex font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 bg-transparent hover:bg-transparent text-light-100 hover:text-white border-transparent p-0';
	}

	return 'text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-0 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-dark-110 dark:border-gray-700 dark:text-white dark:hover:bg-dark-100 mr-2 mb-2';
});

const getSize = computed(() => {
	return `text-${props.size}`;
});

const getAlign = computed(() => {
	if (props.align === 'left') {
		return 'justify-start';
	} else if (props.align === 'right') {
		return 'justify-end';
	}

	return 'justify-center';
});
</script>
