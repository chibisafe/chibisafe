<template>
	<Accordion class="w-full" :value="selectedValue" @change="onChange">
		<AccordionItem
			v-for="(item, index) in items"
			:key="item.key ? item.key : `accordion-${index}`"
			:value="item.key ? item.key : item.title"
		>
			<AccordionTrigger
				class="p-4 items-center cursor-pointer flex font-bold justify-between w-full"
				:class="index !== 0 ? 'border-t-[1px] border-theme-600 dark:border-theme-300' : ''"
			>
				<h1>{{ item.title }}</h1>
				<ChevronDownIcon
					class="h-6 w-6 transition-transform duration-200"
					:class="(item.key ? item.key : item.title) === selectedValue ? 'rotate-180' : 'rotate-0'"
				/>
			</AccordionTrigger>
			<AccordionContent
				class="pl-4 pb-6 pr-8 animate-in fade-in duration-200"
				:class="(item.key ? item.key : item.title) === selectedValue ? 'flex' : 'hidden'"
				><p>{{ item.content }}</p></AccordionContent
			>
		</AccordionItem>
	</Accordion>
</template>

<script setup lang="ts">
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@ark-ui/vue';
import { ChevronDownIcon } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';

interface Props {
	items: [
		{
			title: string;
			content: string;
			key?: string;
		}
	];
}
const props = defineProps<Props>();
const emit = defineEmits(['change']);

const selectedValue = ref();

onMounted(() => {
	selectedValue.value = props.items[0].key ? props.items[0].key : props.items[0].title;
});

const onChange = (value: string[]) => {
	selectedValue.value = value[0];
	emit('change', value[0]);
};
</script>
