<template>
	<ComboboxRoot v-model="v" class="relative" :disabled="!data?.length" @update:modelValue="onChange">
		<ComboboxHeader
			class="min-w-[160px] inline-flex items-center justify-between rounded px-3 text-base leading-none h-9 gap-1 bg-theme-100 dark:bg-theme-600 text-theme-1000 dark:text-theme-100 shadow-[0_2px_10px] shadow-black/10 hover:bg-blue-500 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-theme-800 dark:data-[placeholder]:text-theme-100 outline-none"
		>
			<ComboboxInput
				class="bg-transparent outline-none text-theme-1000 dark:text-theme-100 h-full placeholder-theme-200 dark:placeholder-theme-200 border-0 focus:ring-0 focus:shadow-none focus-visible:ring focus-visible:ring-blue-500"
				:placeholder="placeholder"
			/>
			<ComboboxTrigger>
				<ChevronsUpDownIcon class="h-4 w-4" />
			</ComboboxTrigger>
		</ComboboxHeader>

		<ComboboxContent
			class="absolute z-10 w-fit mt-2 min-w-[160px] bg-theme-100 dark:bg-theme-600 overflow-hidden rounded px-2 py-3"
		>
			<ComboboxViewport>
				<ComboboxGroup>
					<ComboboxItem
						v-for="(option, index) in data"
						:key="index"
						class="text-base leading-none text-theme-1000 dark:text-theme-100 rounded-sm flex items-center h-6 pr-2 pl-2 relative select-none data-[disabled]:text-theme-300 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-500 data-[highlighted]:text-theme-100"
						:value="option"
					>
						<ComboboxItemIndicator class="absolute right-2 w-4 inline-flex items-center justify-center">
							<CheckIcon />
						</ComboboxItemIndicator>
						<span>
							{{ option }}
						</span>
					</ComboboxItem>
				</ComboboxGroup>
			</ComboboxViewport>
		</ComboboxContent>
	</ComboboxRoot>
</template>

<script setup lang="ts">
import { ChevronsUpDownIcon, CheckIcon } from 'lucide-vue-next';
import {
	ComboboxContent,
	ComboboxGroup,
	ComboboxHeader,
	ComboboxInput,
	ComboboxItem,
	ComboboxItemIndicator,
	ComboboxRoot,
	ComboboxTrigger,
	ComboboxViewport
} from 'radix-vue';
import { ref } from 'vue';

interface Props {
	data: string[];
	placeholder?: string;
}

withDefaults(defineProps<Props>(), {
	placeholder: 'Placeholder...'
});

const emit = defineEmits(['change']);
const v = ref('');

const onChange = async () => {
	emit('change', v.value);
};
</script>
