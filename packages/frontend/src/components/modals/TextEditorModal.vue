<template>
	<TransitionRoot appear :show="isModalOpen" as="template" @afterLeave="clearStore">
		<Dialog as="div" class="relative z-10">
			<TransitionChild
				as="template"
				enter="ease-out duration-300"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="ease-in duration-200"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
			</TransitionChild>

			<div class="fixed inset-0 z-10 overflow-y-auto">
				<div class="flex min-h-full items-end justify-center p-4 text-center desktop:items-center desktop:p-0">
					<TransitionChild
						as="template"
						enter="ease-out duration-300"
						enter-from="opacity-0 translate-y-4 desktop:translate-y-0 desktop:scale-95"
						enter-to="opacity-100 translate-y-0 desktop:scale-100"
						leave="ease-in duration-200"
						leave-from="opacity-100 translate-y-0 desktop:scale-100"
						leave-to="opacity-0 translate-y-4 desktop:translate-y-0 desktop:scale-95"
					>
						<DialogPanel
							class="relative transform overflow-hidden rounded-lg bg-dark-110 px-4 pt-5 pb-4 text-left shadow-xl transition-all desktop:my-8 desktop:w-full desktop:max-w-5xl desktop:p-6 desktop:flex desktop:flex-col"
							:class="[showPostCreate ? 'desktop:h-auto' : 'desktop:h-[calc(100vh-8rem)]']"
						>
							<div class="absolute top-0 right-0 hidden pt-4 pr-4 desktop:block">
								<button
									type="button"
									class="rounded-md bg-dark-110 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-0 focus:ring-indigo-500 focus:ring-offset-2"
									@click="closeModal"
								>
									<span class="sr-only">Close</span>
									<XIcon class="h-6 w-6" aria-hidden="true" />
								</button>
							</div>
							<div class="desktop:block desktop:items-start desktop:flex-1">
								<div v-if="showPostCreate" class="mt-3 text-center desktop:mt-0 desktop:text-left">
									<DialogTitle as="h3" class="text-lg font-medium leading-6 text-light-100">
										You just created a new Snippet!
									</DialogTitle>
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
								</div>
								<div v-else class="mt-3 text-center desktop:mt-0 desktop:text-left desktop:h-full">
									<DialogTitle as="h3" class="text-lg font-medium leading-6 text-light-100">
										{{ title }}
									</DialogTitle>
									<div class="mt-4 flex">
										<div class="flex-1">
											<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
												File title
											</label>
											<input
												v-model="snippetTitle"
												class="block p-2.5 w-full leading-5 text-sm rounded-lg border border-dark-80 bg-dark-100 placeholder-gray-400 text-light-100 focus:ring-0 desktop:h-10 font-mono"
												placeholder="Untitled"
												autocomplete="off"
												spellcheck="false"
											/>
										</div>
										<div class="ml-8 w-40">
											<label
												for="languages"
												class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
												>Choose a language</label
											>
											<select
												id="languages"
												v-model="chosenLanguage"
												class="bg-gray-50 border text-sm rounded-lg focus:ring-0 block w-full p-2.5 bg-dark-100 border-dark-80 placeholder-gray-400 text-white"
											>
												<option
													v-for="language in supportedLanguages"
													:key="language.name"
													:value="language.value"
												>
													{{ language.name }}
												</option>
											</select>
										</div>
									</div>
									<div class="items-center desktop:h-[calc(100%-7rem)] mt-4 relative flex flex-col">
										<label
											class="block mb-2 text-sm font-medium text-gray-900 dark:text-white self-start"
										>
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

										<div class="mt-4 w-full text-right">
											<button
												type="button"
												class="mt-3 inline-flex w-full justify-center rounded-md bg-light-100 hover:bg-gray-400 px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-900 focus:outline-none focus:ring-0 focus:ring-indigo-500 focus:ring-offset-2 desktop:mt-0 desktop:w-auto desktop:text-sm"
												@click="closeModal"
											>
												Cancel
											</button>
											<button
												type="button"
												class="inline-flex w-full justify-center rounded-md bg-green-700 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-800 focus:outline-none focus:ring-0 focus:ring-red-500 focus:ring-offset-2 desktop:ml-3 desktop:w-auto desktop:text-sm"
												@click="doAction"
											>
												{{ actionText }}
											</button>
										</div>
									</div>
								</div>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import { useModalStore } from '~/store';
import { XIcon } from 'lucide-vue-next';
import { whenever } from '@vueuse/core';
import { hljs, supportedLanguages } from '~/use/highlight';
import { createSnippet } from '~/use/api';

const props = defineProps<{
	title: string;
	content: string;
	actionText: string;
}>();

const modalsStore = useModalStore();
const isModalOpen = computed(() => modalsStore.textEditor.show);
const inputValue = ref('');
const snippetTitle = ref('');
const passedContent = computed(() => props.content);
const chosenLanguage = ref('plaintext');
const textarea = ref<HTMLTextAreaElement>();
const showPostCreate = ref(false);
const createdSnippet = ref({ uuid: '', raw: '', link: '' });

// Clear the store only after the transition is done to prevent artifacting
const clearStore = () => {
	showPostCreate.value = false;
};

const closeModal = () => {
	modalsStore.textEditor.show = false;
	snippetTitle.value = '';
	inputValue.value = '';
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
	const highlight = hljs.highlightAuto(inputValue.value);
	if (highlight.language) {
		chosenLanguage.value = highlight.language;
	}
};

const doAction = async () => {
	if (inputValue.value === '') return;

	const snippet = await createSnippet(
		snippetTitle.value ?? 'Untitled',
		inputValue.value,
		chosenLanguage.value ?? 'plaintext'
	);
	showPostCreate.value = true;
	createdSnippet.value = snippet?.snippet;
};
</script>
