<template>
	<TransitionRoot appear :show="isModalOpen" as="template" @afterLeave="clearStore">
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
				<div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
			</TransitionChild>

			<div class="fixed inset-0 z-10 overflow-y-auto">
				<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
					<TransitionChild
						as="template"
						enter="ease-out duration-300"
						enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enter-to="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leave-from="opacity-100 translate-y-0 sm:scale-100"
						leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<DialogPanel
							class="relative transform overflow-hidden rounded-lg bg-dark-110 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
						>
							<div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
								<button
									type="button"
									class="rounded-md bg-dark-110 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-0 focus:ring-indigo-500 focus:ring-offset-2"
									@click="closeModal(false)"
								>
									<span class="sr-only">Close</span>
									<IconClose class="h-6 w-6" aria-hidden="true" />
								</button>
							</div>
							<div class="sm:flex sm:items-start">
								<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<DialogTitle as="h3" class="text-lg font-medium leading-6 text-light-100"
										>Delete file</DialogTitle
									>
									<div class="mt-2">
										<p class="text-sm text-light-100">
											Are you sure you want to delete this file? It will be gone forever with no
											way to recover it. It will also remove it from any albums that you added it
											to.
										</p>
									</div>
								</div>
							</div>
							<div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
								<button
									type="button"
									class="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-400 focus:outline-none focus:ring-0 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
									@click="doDeleteFile"
								>
									Delete
								</button>
								<button
									type="button"
									class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-0 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
									@click="closeModal(false)"
								>
									Cancel
								</button>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import IconClose from '~icons/carbon/close';
import { deleteFile, deleteFileAsAdmin } from '~/use/api';

import { useModalStore, useToastStore, useFilesStore } from '~/store';

const modalsStore = useModalStore();
const toastStore = useToastStore();
const filesStore = useFilesStore();

const isModalOpen = computed(() => modalsStore.deleteFile.show);
const file = computed(() => modalsStore.deleteFile.file);
const isAdmin = computed(() => modalsStore.deleteFile.admin);

// Clear the store only after the transition is done to prevent artifacting
const clearStore = () => {
	modalsStore.deleteFile.file = null;
	modalsStore.deleteFile.admin = false;
};

const closeModal = (closeParentModal = false) => {
	modalsStore.deleteFile.show = false;
	if (closeParentModal) modalsStore.fileInformation.show = false;
};

const doDeleteFile = () => {
	if (!file.value) return;

	// If the user is an admin, we need to use the admin endpoint
	if (isAdmin.value) void deleteFileAsAdmin(file.value.uuid);
	// Otherwise, we can use the normal endpoint
	else void deleteFile(file.value.uuid);

	filesStore.removeFile(file.value.uuid);
	toastStore.create('success', 'File deleted');
	closeModal(true);
};
</script>
