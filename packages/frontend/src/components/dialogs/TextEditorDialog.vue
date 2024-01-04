<template>
	<Dialog @update:open="onOpen">
		<DialogTrigger><slot /></DialogTrigger>
		<DialogContent class="max-w-6xl" @escapeKeyDown="event => event.preventDefault()">
			<DialogHeader>
				<DialogTitle>Create a new snippet</DialogTitle>
			</DialogHeader>

			<template v-if="showPostCreate">
				<div class="mt-8 flex flex-col">
					<div class="flex-1">
						<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
							Raw snippet URL (for hotlinking or using in scripts)
						</label>
						<a
							:href="createdSnippet.raw"
							target="_blank"
							rel="noopener noreferrer"
							class="text-blue-400 hover:text-blue-500 transition-colors duration-200 block p-2.5 w-full leading-5 text-sm rounded-lg border border-dark-80 bg-dark-100 placeholder-gray-400 focus:ring-0 desktop:h-10 font-mono"
						>
							{{ createdSnippet.raw }}
						</a>
					</div>

					<div class="flex-1 mt-4">
						<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
							Pretty snippet URL (with syntax highlighting and for sharing)
						</label>
						<a
							:href="createdSnippet.link"
							target="_blank"
							rel="noopener noreferrer"
							class="text-blue-400 hover:text-blue-500 transition-colors duration-200 block p-2.5 w-full leading-5 text-sm rounded-lg border border-dark-80 bg-dark-100 placeholder-gray-400 focus:ring-0 desktop:h-10 font-mono"
						>
							{{ createdSnippet.link }}
						</a>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="mt-4 flex">
					<div class="flex-1">
						<InputWithLabel v-model="snippetTitle" label="Snippet title" name="title" />
					</div>
					<div class="ml-8 w-40">
						<Label for="languages" class="mb-2">Choose a language</Label>
						<select
							id="languages"
							v-model="chosenLanguage"
							class="bg-gray-50 border text-sm rounded-lg focus:ring-0 block w-full p-2.5 bg-dark-100 border-dark-80 placeholder-gray-400 text-white"
						>
							<option v-for="language in supportedLanguages" :key="language.name" :value="language.value">
								{{ language.name }}
							</option>
						</select>
					</div>
				</div>
				<div class="items-center h-[calc(100vh-32rem)] mt-4 relative flex flex-col">
					<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white self-start">
						Text content
					</label>
					<textarea
						ref="textarea"
						v-model="inputValue"
						class="block p-2.5 w-full leading-5 text-sm rounded-lg border border-dark-80 bg-dark-100 placeholder-gray-400 text-light-100 focus:ring-0 font-mono flex-1"
						placeholder="Write your thoughts here..."
						autocomplete="off"
						spellcheck="false"
						@keydown="onKeyDown($event)"
					/>
				</div>
			</template>

			<DialogFooter v-if="!showPostCreate">
				<Button type="button" variant="secondary" @click="doCreateSnippet">Create snippet</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>

<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';
import { whenever } from '@vueuse/core';
import { computed, ref } from 'vue';
import InputWithLabel from '@/components/input/InputWithLabel.vue';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { createSnippet } from '~/use/api';
import { hljs, supportedLanguages } from '~/use/highlight';

const props = defineProps<{
	content: string;
}>();

const inputValue = ref('');
const snippetTitle = ref('');
const passedContent = computed(() => props.content);
const chosenLanguage = ref('plaintext');
const textarea = ref<HTMLTextAreaElement>();
const showPostCreate = ref(false);
const createdSnippet = ref({ uuid: '', raw: '', link: '' });
const timer = ref<any>();
const queryClient = useQueryClient();

const onOpen = async (isOpen: boolean) => {
	if (!isOpen) return;
	snippetTitle.value = '';
	inputValue.value = '';
	showPostCreate.value = false;
};

whenever(passedContent, async () => {
	showPostCreate.value = false;
	inputValue.value = passedContent.value;
});

whenever(inputValue, async () => {
	determineLanguage();
});

const onKeyDown = (event: KeyboardEvent) => {
	if (!textarea.value) return;

	if (event.key === 'Tab') {
		const start = textarea.value.selectionStart;
		const end = textarea.value.selectionEnd;

		textarea.value.value =
			textarea.value.value.slice(0, Math.max(0, start)) + '\t' + textarea.value.value.slice(Math.max(0, end));
		textarea.value.selectionEnd = start + 1;
		textarea.value.focus();

		event.preventDefault();
	}
};

const determineLanguage = () => {
	// eslint-disable-next-line no-restricted-globals
	if (timer.value) clearTimeout(timer.value);
	// eslint-disable-next-line no-restricted-globals
	timer.value = setTimeout(() => {
		const highlight = hljs.highlightAuto(inputValue.value);
		if (highlight.language) {
			chosenLanguage.value = highlight.language;
		}
	}, 500);
};

const doCreateSnippet = async () => {
	if (inputValue.value === '') return;

	const snippet = await createSnippet(
		snippetTitle.value ?? 'Untitled',
		inputValue.value,
		chosenLanguage.value ?? 'plaintext'
	);
	showPostCreate.value = true;
	createdSnippet.value = snippet?.snippet;
	queryClient.invalidateQueries({ queryKey: ['snippets'] });
};
</script>
