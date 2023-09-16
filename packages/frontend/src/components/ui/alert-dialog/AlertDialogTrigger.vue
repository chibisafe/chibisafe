<script setup lang="ts">
import { AlertDialogTrigger, type AlertDialogTriggerProps } from 'radix-vue';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface ExtendedWithButton extends AlertDialogTriggerProps {
	variant?: 'default' | 'link' | 'destructive' | 'outline' | 'secondary' | 'ghost' | null | undefined;
}

const props = defineProps<ExtendedWithButton>();
</script>

<template>
	<AlertDialogTrigger v-bind="props" :class="cn(buttonVariants({ variant }), 'mt-2 sm:mt-0', $attrs.class ?? '')">
		<slot />
	</AlertDialogTrigger>
</template>
