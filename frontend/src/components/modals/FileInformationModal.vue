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
								<div class="flex flex-1 justify-center items-center">
									<img v-if="!isFileVideo(file)" :src="file.url" class="max-w-full h-fit" />
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
											class="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-0 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-dark-110 dark:border-gray-700 dark:text-white dark:hover:bg-dark-100 mr-2 mb-2"
											>Open</a
										>
										<!-- <Button class="flex-auto">Open</Button> -->
										<Button class="flex-auto mr-0">Delete</Button>
									</div>

									<h2 class="text-dark-100 dark:text-light-100 mt-1">File info</h2>

									<InputWithOverlappingLabel class="mt-4" label="UUID" :value="file.uuid" readOnly />
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

									<h2 class="text-dark-100 dark:text-light-100 mt-4 mb-4">Albums</h2>

									<ul
										class="w-full max-h-[540px] text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-dark-110 dark:border-dark-90 dark:text-white overflow-y-auto"
									>
										<li
											v-for="album in albums"
											:key="album.uuid"
											class="w-full rounded-t-lg border-b border-gray-200 dark:border-dark-90"
										>
											<div class="flex items-center pl-3">
												<input
													:id="album.uuid"
													type="checkbox"
													value=""
													:checked="album.selected"
													class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-0 checked:bg-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:bg-dark-90 dark:border-gray-500"
													@change="clickedAlbum(!album.selected, album.uuid)"
												/>
												<label
													:for="album.uuid"
													class="py-3 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300"
													>{{ album.name }}</label
												>
											</div>
										</li>
									</ul>
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
import type { AlbumWithSelected } from '~/types';
import { ref, computed, watch } from 'vue';
import { TransitionRoot, TransitionChild, Dialog, DialogOverlay } from '@headlessui/vue';
import { useClipboard } from '@vueuse/core';
import { useModalstore } from '~/store/modals';
import { useAlbumsStore } from '~/store/albums';
import { formatBytes, isFileVideo } from '~/use/file';
import { addFileToAlbum, removeFileFromAlbum } from '~/use/api';
import InputWithOverlappingLabel from '~/components/forms/InputWithOverlappingLabel.vue';
import Button from '~/components/buttons/Button.vue';

const modalsStore = useModalstore();
const albumsStore = useAlbumsStore();
void albumsStore.get();

const isModalOpen = computed(() => modalsStore.fileInformation.show);
const file = computed(() => modalsStore.fileInformation.file);
const fileAlbums = computed(() => modalsStore.fileInformation.albums);

const albums = computed(() => {
	if (!fileAlbums.value) return albumsStore.albums as AlbumWithSelected[];
	return albumsStore.albums.map(album => {
		return {
			...album,
			selected: fileAlbums.value.includes(album.uuid)
		};
	}) as AlbumWithSelected[];
});

const clickedAlbum = async (newValue: boolean, uuid: string) => {
	if (!file.value) return;
	if (newValue) {
		modalsStore.fileInformation.albums.push(uuid);
		await addFileToAlbum(file.value.uuid, uuid);
	} else {
		const index = modalsStore.fileInformation.albums.indexOf(uuid);
		if (index > -1) {
			modalsStore.fileInformation.albums.splice(index, 1);
			await removeFileFromAlbum(file.value.uuid, uuid);
		}
	}
};

const { copy } = useClipboard();
const isCopying = ref(false);

watch(file, async () => {
	if (file.value?.uuid) {
		void modalsStore.getFileAlbums();
	}
});

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
