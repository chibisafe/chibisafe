<template>
	<TooltipProvider>
		<Tooltip>
			<TooltipTrigger>
				<slot />
			</TooltipTrigger>
			<TooltipContent>
				<p>{{ text }}</p>
			</TooltipContent>
		</Tooltip>
	</TooltipProvider>
</template>

<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
defineProps<{
	text: string;
}>();
</script>
