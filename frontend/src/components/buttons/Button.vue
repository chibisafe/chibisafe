<template>
	<button
		type="button"
		class="inline-flex font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
		:class="[getVariant, getAlign, `text-${props.size}`]"
	>
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
		return 'bg-transparent hover:bg-transparent text-chibisafe-text-light hover:text-white border-transparent p-0';
	} else if (props.variant === 'none') {
		return '';
	}

	return 'h-[42px] px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 border border-transparent rounded hover:bg-[#14151d]';
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
