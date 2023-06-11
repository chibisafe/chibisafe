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
							class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
						>
							<div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
								<button
									type="button"
									class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-0 focus:ring-indigo-500 focus:ring-offset-2"
									@click="closeModal"
								>
									<span class="sr-only">Close</span>
									<IconClose class="h-6 w-6" aria-hidden="true" />
								</button>
							</div>
							<div class="sm:flex sm:items-start">
								<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
										<template v-if="link">
											<span>Delete link </span>
											<span class="font-bold">{{ link?.identifier }}</span>
										</template>
										<template v-else>
											<span class="capitalize">{{ action }} album </span>
											<span class="font-bold">{{ album?.name }}</span>
										</template>
									</DialogTitle>
									<div class="mt-2 text-sm text-gray-500">
										<p v-if="action === 'deletelink'">
											This action will delete the public link associated to this album and prevent
											people from accessing it from hereon. If you decide to undo this action keep
											in mind that you won't be able to get the same public link again.<br />
										</p>
										<p v-if="action === 'delete'">
											This action will delete the album and every public link associated with
											it.<br />
											All uploaded files will remain intact.
										</p>
										<p v-if="action === 'purge'">
											This action will delete the album and ALL files associated with it, even if
											they are part of more than just this album.<br />
											This action is not reversible.
										</p>
									</div>
								</div>
							</div>
							<div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
								<button
									type="button"
									class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-400 focus:outline-none focus:ring-0 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
									@click="doAction"
								>
									<span v-if="action === 'deletelink'">Delete</span>
									<span v-else class="capitalize">{{ action }}</span>
								</button>
								<button
									type="button"
									class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-0 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
									@click="closeModal"
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
import { deleteAlbumLink, deleteAlbum, purgeAlbum } from '~/use/api';

import { useModalStore } from '~/store';

const modalsStore = useModalStore();

const isModalOpen = computed(() => modalsStore.manageAlbum.show);
const album = computed(() => modalsStore.manageAlbum.album);
const action = computed(() => modalsStore.manageAlbum.action);
const link = computed(() => modalsStore.manageAlbum.link);
const callback = computed(() => modalsStore.manageAlbum.callback);

// Clear the store only after the transition is done to prevent artifacting
const clearStore = () => {
	modalsStore.manageAlbum.album = null;
	modalsStore.manageAlbum.action = null;
};

const closeModal = () => {
	modalsStore.manageAlbum.show = false;
};

const doAction = () => {
	if (!album.value) return;
	if (action.value === 'deletelink') {
		if (!link.value) return;
		void deleteAlbumLink(album.value.uuid, link.value.uuid);
	}

	if (action.value === 'delete') void deleteAlbum(album.value.uuid);
	if (action.value === 'purge') void purgeAlbum(album.value.uuid);
	callback.value?.();
	closeModal();

	// TODO: Enable 2-way binding for this, otherwise the table won't update until refresh
};
</script>
