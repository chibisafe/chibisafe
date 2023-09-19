<script setup lang="ts">
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { badgeVariants } from '.';

interface BadgeVariantProps extends VariantProps<typeof badgeVariants> {}

interface Props {
	variant?: BadgeVariantProps['variant'];
}
defineProps<Props>();
</script>

<template>
	<div :class="cn(badgeVariants({ variant }), $attrs.class ?? '')">
		<slot />
	</div>
</template>
