<template>
	<div class="flex flex-col mt-4 relative">
		<Label for="tagsinput" class="text-left"
			>Pressing ENTER will add a tag or create it if it doesn't exist. <br />Clicking on an existing tag will
			remove it from the file.</Label
		>
		<div class="bg-dark-110 flex flex-row flex-wrap gap-2 p-2 rounded-lg border border-dark-80 mt-2">
			<Badge
				v-for="tag in fileTags"
				:key="tag.uuid"
				variant="default"
				class="text-sm bg-red-900 hover:bg-red-700 h-7 w-fit flex cursor-pointer group relative"
				@click="emit('tag:clicked', tag)"
			>
				{{ tag.name }}
			</Badge>
			<Input
				id="tagsinput"
				ref="inputElement"
				v-model="inputValue"
				class="w-40 bg-dark-85 h-7"
				@keyup.enter.prevent="addTag"
				@input="suggestTags"
				@click="showAllTags"
			/>
		</div>
		<div v-if="suggestions?.length" class="mt-2 bg-dark-85 pb-2">
			<ScrollArea>
				<div class="w-full flex flex-wrap gap-2 p-2 rounded-md border h-52">
					<Button
						v-for="tag in suggestions"
						:key="tag.uuid"
						variant="default"
						class="text-sm bg-red-900 hover:bg-red-700 h-7 w-fit flex cursor-pointer"
						@click="clickedSuggestedTag(tag)"
					>
						{{ tag.name }}
					</Button>
				</div>
			</ScrollArea>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import { ref } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tag } from '@/types';
import { createTag } from '~/use/api';

const props = defineProps<{
	fileTags: {
		uuid: string;
		name: string;
	}[];
	tags: {
		uuid: string;
		name: string;
	}[];
}>();

const emit = defineEmits(['selected', 'tag:clicked']);

const inputElement = ref<HTMLInputElement>();
const inputValue = ref('');
const suggestions = ref<Tag[]>();

onClickOutside(inputElement, () => {
	suggestions.value = [];
});

const showAllTags = () => {
	// Show all tags that are not already added to the file
	suggestions.value = props.tags.filter(tag => !props.fileTags.some(t => t.name === tag.name));
};

const suggestTags = (event: Event) => {
	const value = (event.target as HTMLInputElement).value;
	if (value === '') return;

	// Return the list of tags that start with the input value and are not already added to the file
	suggestions.value = props.tags.filter(
		tag => tag.name.toLowerCase().includes(value.toLowerCase()) && !props.fileTags.some(t => t.name === tag.name)
	);
};

const clickedSuggestedTag = (tag: Tag) => {
	inputValue.value = tag.name;
	addTag();
};

const addTag = async () => {
	if (inputValue.value === '') return;
	if (props.fileTags.some(tag => tag.name === inputValue.value)) {
		inputValue.value = '';
		return;
	}

	const exists = props.tags.find(tag => tag.name === inputValue.value);
	if (exists) {
		emit('selected', { uuid: exists.uuid, name: exists.name });
		inputValue.value = '';
		return;
	}

	const created = await createTag(inputValue.value);
	emit('selected', { uuid: created.uuid, name: created.name });
	// eslint-disable-next-line require-atomic-updates
	inputValue.value = '';
};
</script>
