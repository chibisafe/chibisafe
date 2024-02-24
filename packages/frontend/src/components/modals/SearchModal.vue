<template>
	<TransitionRoot :show="isModalOpen" as="template" appear @afterLeave="clearStore">
		<Dialog as="div" class="relative z-10" @close="closeModal">
			<TransitionChild
				as="template"
				enter="ease-out duration-300"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="ease-in duration-200"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
			</TransitionChild>

			<div class="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
				<TransitionChild
					as="template"
					enter="ease-out duration-300"
					enter-from="opacity-0 scale-95"
					enter-to="opacity-100 scale-100"
					leave="ease-in duration-200"
					leave-from="opacity-100 scale-100"
					leave-to="opacity-0 scale-95"
				>
					<DialogPanel
						class="mx-auto max-w-2xl transform divide-y divide-gray-500 divide-opacity-20 overflow-hidden rounded-xl bg-dark-90 shadow-2xl transition-all"
					>
						<Combobox @update:modelValue="onSelect">
							<div class="relative">
								<SearchIcon
									class="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-500"
									aria-hidden="true"
								/>
								<ComboboxInput
									class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-white focus:ring-0 sm:text-sm"
									placeholder="Search..."
									@change="query = $event.target.value"
								/>
							</div>

							<ComboboxOptions
								static
								class="max-h-80 scroll-py-2 divide-y divide-gray-500 divide-opacity-20 overflow-y-auto"
							>
								<li class="p-2">
									<h2 class="sr-only">Quick actions</h2>
									<ul class="text-sm text-gray-400">
										<ComboboxOption
											v-for="action in quickActions"
											:key="action.name"
											v-slot="{ active }"
											:value="action"
											as="template"
										>
											<li
												class="flex cursor-default select-none items-center rounded-md px-3 py-2"
												:class="[active && 'bg-dark-100 text-white']"
											>
												<component
													:is="action.icon"
													class="h-6 w-6 flex-none text-light-100"
													aria-hidden="true"
												/>
												<span class="ml-3 flex-auto truncate text-light-100">{{
													action.name
												}}</span>
											</li>
										</ComboboxOption>
									</ul>
								</li>
							</ComboboxOptions>
							<div
								class="flex flex-wrap items-center bg-gray-50 px-4 py-2.5 text-xs text-light-100 mobile:hidden"
							>
								Press
								<kbd
									class="mx-1 flex h-5 w-16 items-center justify-center rounded border bg-dark-90 font-semibold sm:mx-2 border-gray-400 text-light-100"
									>CTRL + K</kbd
								>
								<span class="sm:hidden">to open this search bar</span>
							</div>
						</Combobox>
					</DialogPanel>
				</TransitionChild>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup lang="ts">
import {
	Combobox,
	ComboboxInput,
	ComboboxOptions,
	ComboboxOption,
	Dialog,
	DialogPanel,
	TransitionChild,
	TransitionRoot
} from '@headlessui/vue';
import { SearchIcon, FileUpIcon, LibraryIcon, UserIcon, CodeIcon } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useModalStore } from '~/store';

const router = useRouter();
const modalsStore = useModalStore();
const isModalOpen = computed(() => modalsStore.search.show);

const closeModal = () => {
	modalsStore.search.show = false;
};

const clearStore = () => {
	query.value = '';
};

const query = ref('');

const doSearch = async () => {
	void router.push('/dashboard/uploads?search=' + query.value);
};

const goCreateAlbum = async () => {
	await router.push('/dashboard/albums');
	modalsStore.newAlbum.show = true;
};

const goToUploads = () => {
	void router.push('/dashboard/uploads');
};

const goToAlbums = () => {
	void router.push('/dashboard/albums');
};

const goToSnippets = () => {
	void router.push('/dashboard/snippets');
};

const goToAccount = () => {
	void router.push('/dashboard/account');
};

const onSelect = (value: any) => {
	void value.callback();
	closeModal();
};

const quickActions = [
	{ name: 'Search...', icon: SearchIcon, callback: doSearch },
	// { name: 'Upload new file...', icon: FileUpIcon, callback: goToMainPage },
	{ name: 'Create new album...', icon: LibraryIcon, callback: goCreateAlbum },
	{ name: 'Go to uploads...', icon: FileUpIcon, callback: goToUploads },
	{ name: 'Go to albums...', icon: LibraryIcon, callback: goToAlbums },
	{ name: 'Go to snippets...', icon: CodeIcon, callback: goToSnippets },
	{ name: 'Go to my account...', icon: UserIcon, callback: goToAccount }
];
</script>
