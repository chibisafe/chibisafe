<template>
	<ComboboxRoot v-model="v" class="relative" :disabled="!data.length" @update:modelValue="getValueFromLabel">
		<ComboboxAnchor
			class="min-w-[160px] inline-flex items-center pr-2 justify-between rounded text-[13px] leading-none h-[35px] gap-[5px] bg-dark-90 text-grass11 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-grass9 outline-none"
		>
			<ComboboxInput
				class="bg-transparent outline-none border-none focus:ring-0 text-grass11 h-full selection:bg-grass5 placeholder-foreground"
				:placeholder="placeholder"
			/>
			<ComboboxTrigger>
				<ChevronsUpDownIcon class="h-4 w-4 text-grass11" />
			</ComboboxTrigger>
		</ComboboxAnchor>

		<ComboboxContent
			class="absolute z-10 w-full mt-2 min-w-[160px] bg-dark-90 overflow-hidden rounded shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
		>
			<ComboboxViewport class="p-[5px]">
				<ComboboxEmpty class="text-mauve8 text-sm font-medium text-center py-2" />
				<ScrollArea>
					<ComboboxGroup class="max-h-[300px]">
						<ComboboxItem
							v-for="(option, index) in data"
							:key="index"
							class="text-sm leading-none text-grass11 rounded-[3px] flex items-center h-8 pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-dark-80 data-[highlighted]:text-grass1"
							:value="option.label"
						>
							<ComboboxItemIndicator class="absolute left-1 w-4 inline-flex items-center justify-center">
								<CheckIcon />
							</ComboboxItemIndicator>
							<span>
								{{ option.label }}
							</span>
						</ComboboxItem>
					</ComboboxGroup>
				</ScrollArea>
			</ComboboxViewport>
		</ComboboxContent>
	</ComboboxRoot>
</template>

<script setup lang="ts">
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-vue-next';
import {
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxAnchor,
	ComboboxInput,
	ComboboxItem,
	ComboboxItemIndicator,
	ComboboxRoot,
	ComboboxTrigger,
	ComboboxViewport
} from 'radix-vue';
import { ref, nextTick } from 'vue';
import { ScrollArea } from '@/components/ui/scroll-area';

const props = defineProps<{
	data: {
		value: string;
		label: string;
	}[];
	placeholder: string;
}>();

const emit = defineEmits(['selected']);
const v = ref('');

const getValueFromLabel = async (label: any) => {
	const option = props.data.find((item: any) => item.label === label);
	if (!option) return;
	emit('selected', option.value);
	await nextTick();
	v.value = '';
};
</script>
