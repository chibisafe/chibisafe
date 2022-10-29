<template>
	<TransitionRoot appear :show="isModalOpen" as="template" @afterLeave="clearStore">
		<Dialog as="div" @close="closeModal">
			<DialogOverlay class="fixed inset-0 bg-black opacity-50" />
			<div class="fixed inset-0 z-10 overflow-y-auto">
				<div class="min-h-screen px-4 text-center">
					<TransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0"
						enter-to="opacity-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100"
						leave-to="opacity-0"
					>
						<DialogOverlay class="fixed inset-0" />
					</TransitionChild>

					<span class="inline-block h-screen align-middle" aria-hidden="true"> &#8203; </span>

					<TransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95"
					>
						<div
							class="inline-block max-h-[calc(100vh-8rem)] w-full max-w-5xl p-4 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-dark-90 shadow-xl rounded-md overflow-y-auto"
						>
							<div v-if="file" class="flex">
								<!-- File preview -->
								<div class="flex flex-1">
									<img v-if="!isFileVideo(file)" :src="file.url" class="max-w-full h-auto" />
									<video v-else controls>
										<source :src="file.url" :type="file.type" />
									</video>
								</div>
								<!-- File information panel -->
								<div class="flex flex-col w-1/3 pl-4">
									<div class="flex justify-between">
										<Button class="flex-auto" @click="copyLink">{{
											isCopying ? 'Copied!' : 'Copy link'
										}}</Button>
										<a
											:href="file.url"
											target="_blank"
											rel="noopener noreferrer"
											class="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-0 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-2"
											>Open</a
										>
										<!-- <Button class="flex-auto">Open</Button> -->
										<Button class="flex-auto mr-0">Delete</Button>
									</div>

									<h2 class="text-dark-100 dark:text-light-100">File info</h2>

									<InputWithOverlappingLabel class="mt-8" label="UUID" :value="file.uuid" readOnly />
									<InputWithOverlappingLabel class="mt-4" label="Name" :value="file.name" readOnly />
									<InputWithOverlappingLabel
										class="mt-4"
										label="Original Name"
										:value="file.original"
										readOnly
									/>
									<InputWithOverlappingLabel class="mt-4" label="IP" :value="file.ip" readOnly />
									<InputWithOverlappingLabel
										class="mt-4"
										label="Link"
										type="link"
										:value="file.url"
										readOnly
									/>
									<InputWithOverlappingLabel
										class="mt-4"
										label="Size"
										:value="String(formatBytes(file.size))"
										readOnly
									/>
									<InputWithOverlappingLabel class="mt-4" label="Hash" :value="file.hash" readOnly />
									<InputWithOverlappingLabel
										class="mt-4"
										label="Uploaded"
										:value="file.createdAt"
										readOnly
									/>
								</div>
							</div>
						</div>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { TransitionRoot, TransitionChild, Dialog, DialogOverlay, DialogTitle } from '@headlessui/vue';
import { useClipboard } from '@vueuse/core';
import { useModalstore } from '~/store/modals';
import { formatBytes, isFileVideo } from '~/use/file';
import InputWithOverlappingLabel from '~/components/forms/InputWithOverlappingLabel.vue';
import Button from '~/components/buttons/Button.vue';

const modalsStore = useModalstore();
const isModalOpen = computed(() => modalsStore.fileInformation.show);
const file = computed(() => modalsStore.fileInformation.file);

const { copy } = useClipboard();
const isCopying = ref(false);

const copyLink = () => {
	if (isCopying.value) return;
	isCopying.value = true;

	if (file.value?.url) void copy(file.value?.url);
	// eslint-disable-next-line no-restricted-globals
	setTimeout(() => (isCopying.value = false), 1000);
};

// Clear the store only after the transition is done to prevent artifacting
const clearStore = () => {
	modalsStore.fileInformation.file = null;
};

const closeModal = () => {
	modalsStore.fileInformation.show = false;
};
</script>
