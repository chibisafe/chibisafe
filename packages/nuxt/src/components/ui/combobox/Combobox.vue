<template>
	<ClientOnly>
		<Combobox
			:items="items"
			openOnClick
			closeOnSelect
			:inputValue="search"
			:onValueChange="onValueChanged"
			:value="selected"
			:onInputValueChange="onValueChanged"
			:onHighlightChange="onValueChanged"
			:highlightedValue="selected"
		>
			<ComboboxLabel class="block text-theme-1000 dark:text-theme-100 mb-1"
				>__this component doesnt work whatsoever__ - {{ search }} - {{ selected }}</ComboboxLabel
			>
			<ComboboxControl class="relative">
				<ComboboxInput
					class="rounded-md bg-white dark:bg-theme-500 border-theme-200 dark:border-theme-400 px-3 py-2 shadow-sm block w-full border-1 p-0 text-theme-1000 dark:text-theme-100 placeholder-gray-500 focus:ring-0 sm:text-sm"
				/>

				<ComboboxTrigger>
					<Button variant="none" class="!absolute top-1 right-1">
						<ChevronsUpDownIcon />
					</Button>
				</ComboboxTrigger>
				<!-- <ComboboxClearTrigger>Clear</ComboboxClearTrigger> -->
			</ComboboxControl>
			<Teleport to="body">
				<ComboboxPositioner>
					<ComboboxContent
						class="rounded-md bg-white dark:bg-theme-500 border-theme-200 dark:border-theme-400 py-2 shadow-sm block w-full border-1 p-0 text-theme-1000 dark:text-theme-100 placeholder-gray-500 focus:ring-0 sm:text-sm"
					>
						<ComboboxOptionGroup id="values">
							<!--
							  <ComboboxOptionGroupLabel htmlFor="values" class="px-4"
							  >Frameworks</ComboboxOptionGroupLabel
							  > 
							-->
							<ComboboxOption
								v-for="item in items"
								:key="item.value"
								:item="item"
								:value="item.value"
								:label="item.label"
								class="h-7 px-4 text-base flex items-center rounded hover:bg-blue-500 relative"
							>
								{{ item.label }}
								<CheckIcon class="absolute w-3 h-3 right-3" />
							</ComboboxOption>
						</ComboboxOptionGroup>
					</ComboboxContent>
				</ComboboxPositioner>
			</Teleport>
		</Combobox>
	</ClientOnly>
</template>

<script setup lang="ts">
import {
	Combobox,
	// ComboboxClearTrigger,
	ComboboxContent,
	ComboboxControl,
	ComboboxInput,
	ComboboxLabel,
	ComboboxOption,
	ComboboxOptionGroup,
	// ComboboxOptionGroupLabel,
	ComboboxPositioner,
	ComboboxTrigger
} from '@ark-ui/vue';
import { ChevronsUpDownIcon, CheckIcon } from 'lucide-vue-next';
import { ref, computed } from 'vue';
import Button from '@/components/ui/button/Button.vue';

const selected = ref('');
const search = ref('');

const onValueChanged = (value: any) => {
	// search.value = value;
	console.log(value);
};

const items = [
	{ label: 'React', value: 'react' },
	{ label: 'Solid', value: 'solid' },
	{ label: 'Vue', value: 'vue' },
	{ label: 'Svelte', value: 'svelte' }
];
</script>
