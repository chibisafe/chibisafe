<template>
	<button type="button" :class="button({ color: variant, disabled: disabled || loading })" @click="$emit('click')">
		<template v-if="loading">
			<Loader2Icon class="animate-spin mr-2" />
		</template>
		<slot />
	</button>
</template>

<script setup lang="ts">
import { Loader2Icon } from 'lucide-vue-next';
import { tv } from 'tailwind-variants';

interface Props {
	variant?: 'primary' | 'success' | 'destructive';
	loading?: boolean;
	disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
	variant: 'primary'
});

defineEmits(['click']);

const button = tv({
	base: 'text-theme-1000 dark:text-theme-100 border font-medium inline-flex justify-center items-center leading-6 px-4 py-2 rounded-md shadow-sm focus:shadow-none text-base w-fit whitespace-no-wrap focus:outline-none',
	variants: {
		color: {
			primary:
				'bg-white dark:bg-theme-500 hover:bg-gray-50 hover:dark:bg-theme-600 dark:border-theme-400 border-gray-200',
			success:
				'bg-green-600 hover:bg-green-700 text-theme-100 dark:bg-green-700 dark:hover:bg-green-800 dark:border-green-700',
			destructive: 'bg-red-500 hover:bg-red-600 text-theme-100 border-red-700 dark:border-red-500'
		},
		disabled: {
			true: 'opacity-70 pointer-events-none'
		}
	},
	defaultVariants: {
		color: 'primary'
	}
});
</script>
