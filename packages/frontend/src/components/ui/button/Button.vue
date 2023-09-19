<script setup lang="ts">
import { cn } from '@/lib/utils';
import { buttonVariants } from '.';

interface Props {
	// eslint-disable-next-line vue/require-default-prop
	variant?: NonNullable<Parameters<typeof buttonVariants>[0]>['variant'];
	// eslint-disable-next-line vue/require-default-prop
	size?: NonNullable<Parameters<typeof buttonVariants>[0]>['size'];
	as?: string;
}

withDefaults(defineProps<Props>(), {
	as: 'button'
});
</script>

<template>
	<component :is="as" :class="cn(buttonVariants({ variant, size }), $attrs.class ?? '')">
		<slot />
	</component>
</template>
