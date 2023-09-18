<script setup lang="ts">
import { DialogTrigger, type DialogTriggerProps } from 'radix-vue';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface ExtendedWithButton extends DialogTriggerProps {
	variant?: NonNullable<Parameters<typeof buttonVariants>[0]>['variant'];
}

const props = defineProps<ExtendedWithButton>();
</script>

<template>
	<DialogTrigger v-bind="props" :class="cn(buttonVariants({ variant }), '', $attrs.class ?? '')">
		<slot />
	</DialogTrigger>
</template>
