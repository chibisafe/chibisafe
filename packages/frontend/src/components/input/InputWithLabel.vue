<template>
	<div class="grid w-full max-w-sm items-center gap-1.5">
		<Label :for="name">{{ label }}</Label>
		<Input
			:id="name"
			:type="type"
			:class="[blur ? 'blur-sm hover:blur-none' : '']"
			:readonly="readOnly"
			:placeholder="placeholder"
			:modelValue="modelValue"
			@update:modelValue="updateValue"
		/>
	</div>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
	label: string;
	name: string;
	modelValue: string | number;
	readOnly?: boolean;
	placeholder?: string;
	type?: string;
	blur?: boolean;
}

withDefaults(defineProps<Props>(), {
	label: 'change-me',
	name: '',
	modelValue: '',
	placeholder: '',
	type: 'text'
});

const emit = defineEmits(['update:modelValue']);
const updateValue = (value: string | number) => {
	emit('update:modelValue', value);
};
</script>
