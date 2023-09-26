<template>
	<Checkbox
		:checked="modelValue"
		class="flex w-fit"
		:class="[inverted ? 'flex-row-reverse' : 'flex-row']"
		@change="onChange"
	>
		<CheckboxLabel><slot /></CheckboxLabel>
		<CheckboxControl
			class="h-6 w-6 flex justify-center items-center border-[2px] rounded cursor-pointer"
			:class="[inverted ? 'mr-2' : 'ml-2', checked ? 'bg-blue-500 border-blue-500' : 'bg-none border-gray-600']"
		>
			<CheckIcon v-if="checked" class="h-4 w-4" />
		</CheckboxControl>
	</Checkbox>
</template>

<script setup lang="ts">
import { Checkbox, CheckboxControl, CheckboxLabel, type CheckedState } from '@ark-ui/vue';
import { CheckIcon } from 'lucide-vue-next';
import { ref } from 'vue';

defineProps({
	modelValue: {
		type: Boolean
	},
	inverted: {
		type: Boolean
	}
});
const emit = defineEmits(['change', 'update:modelValue']);
const checked = ref<CheckedState>(false);
const onChange = (value: any) => {
	checked.value = value;
	emit('change', value);
	emit('update:modelValue', value);
};
</script>
