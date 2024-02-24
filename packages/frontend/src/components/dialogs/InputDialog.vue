<template>
	<Dialog>
		<DialogTrigger as-child>
			<slot />
		</DialogTrigger>

		<DialogContent class="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>{{ title }}</DialogTitle>
				<DialogDescription v-if="message">
					{{ message }}
				</DialogDescription>
			</DialogHeader>
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Label v-if="label" for="input" class="text-right"> {{ label }} </Label>
					<Input id="input" v-model="inputValue" class="col-span-3" />
				</div>
			</div>
			<DialogFooter>
				<DialogClose as-child>
					<Button type="button" variant="default" @click="callback(inputValue)">{{ proceedText }}</Button>
				</DialogClose>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
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

withDefaults(defineProps<Props>(), {
	title: 'Are you sure?',
	message: '',
	label: '',
	proceedText: 'Continue',
	variant: 'default',
	callback: () => {}
});

const inputValue = ref('');
</script>
