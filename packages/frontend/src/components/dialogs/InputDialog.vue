<template>
	<Dialog :open="isOpen">
		<Button variant="outline" @click="isOpen = true"><slot /></Button>
		<DialogContent class="sm:max-w-[425px]" @escape-key-down.prevent>
			<DialogHeader>
				<DialogTitle>{{ title }}</DialogTitle>
				<DialogDescription v-if="message">
					Make changes to your profile here. Click save when you're done.
				</DialogDescription>
			</DialogHeader>
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Label v-if="label" for="input" class="text-right"> {{ label }} </Label>
					<Input id="input" v-model="inputValue" class="col-span-3" @keyup.enter="returnCallback" />
				</div>
			</div>
			<DialogFooter>
				<Button type="button" variant="default" @click="returnCallback">{{ proceedText }}</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
	title: string;
	message?: string;
	label?: string;
	proceedText?: string;
	// eslint-disable-next-line no-unused-vars
	callback: (value: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
	title: 'Are you sure?',
	message: '',
	label: '',
	proceedText: 'Continue',
	// eslint-disable-next-line no-unused-vars
	callback: (value: string) => {}
});

const isOpen = ref(false);
const inputValue = ref('');

const returnCallback = () => {
	props.callback(inputValue.value);
	isOpen.value = false;
};
</script>
