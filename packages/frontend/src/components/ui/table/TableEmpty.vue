<script setup lang="ts">
import { cn } from '@/lib/utils';
import TableCell from './TableCell.vue';
import TableRow from './TableRow.vue';

interface Props {
	class?: string;
	colspan?: number;
}

const props = withDefaults(defineProps<Props>(), {
	class: '',
	colspan: 1
});
</script>

<template>
	<TableRow>
		<TableCell
			:class="cn('p-4 whitespace-nowrap align-middle text-sm text-foreground', props.class)"
			:colspan="props.colspan"
		>
			<div class="flex items-center justify-center py-10">
				<slot />
			</div>
		</TableCell>
	</TableRow>
</template>
