<!-- eslint-disable vue/no-deprecated-slot-attribute -->
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
							class="inline-block max-h-96 w-full max-w-sm p-4 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-dark-110 shadow-xl rounded-md overflow-y-auto"
						>
							<label class="block text-sm font-medium text-gray-700 dark:text-light-100">Name</label>
							<div class="mt-1">
								<Input v-model="name" type="text" autocomplete="off" @keyup.enter="createNewAlbum" />
							</div>
							<div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
								<Button class="mr-0" type="success" @click="createNewAlbum">Create</Button>
								<Button @click="closeModal">Cancel</Button>
							</div>
						</div>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
	<DeleteFileModal />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { TransitionRoot, TransitionChild, Dialog, DialogOverlay } from '@headlessui/vue';
import { useModalStore, useToastStore, useAlbumsStore } from '~/store';
import { createAlbum } from '~/use/api';
import Button from '~/components/buttons/Button.vue';

const modalsStore = useModalStore();
const toastStore = useToastStore();
const albumsStore = useAlbumsStore();

const name = ref('');

const isModalOpen = computed(() => modalsStore.newAlbum.show);

// Clear the store only after the transition is done to prevent artifacting
const clearStore = () => {
	name.value = '';
};

const closeModal = () => {
	modalsStore.newAlbum.show = false;
};

const createNewAlbum = async () => {
	if (!name.value) return;
	await createAlbum(name.value);

	// Refresh the album list on the store
	void albumsStore.get(true);

	toastStore.create('success', 'Album created');
	closeModal();
};
</script>
