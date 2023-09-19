<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
	<TransitionRoot appear :show="isModalOpen" as="template" @afterLeave="clearStore">
		<Dialog as="div" @close="closeModal">
			<DialogOverlay class="fixed inset-0 bg-black opacity-80" />
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
							class="inline-block max-h-[calc(100vh-8rem)] w-full max-w-5xl p-4 overflow-hidden text-left align-middle transition-all transform bg-dark-110 shadow-xl rounded-md overflow-y-auto"
						>
							<div v-if="file" class="flex mobile:flex-col">
								<!-- File preview -->
								<div class="flex flex-1 justify-center items-center">
									<img v-if="isFileImage(file)" :src="file.url" class="max-w-full h-fit" />

									<media-controller v-else-if="isFileVideo(file)">
										<video slot="media" :src="file.url" crossorigin=""></video>
										<media-control-bar>
											<media-play-button></media-play-button>
											<media-mute-button></media-mute-button>
											<media-volume-range></media-volume-range>
											<media-time-range></media-time-range>
											<media-pip-button></media-pip-button>
											<media-fullscreen-button></media-fullscreen-button>
										</media-control-bar>
									</media-controller>

									<media-controller v-else-if="isFileAudio(file)" audio>
										<audio slot="media" :src="file.url"></audio>
										<media-control-bar>
											<media-play-button></media-play-button>
											<media-time-display show-duration></media-time-display>
											<media-time-range></media-time-range>
											<media-playback-rate-button></media-playback-rate-button>
											<media-mute-button></media-mute-button>
											<media-volume-range></media-volume-range>
										</media-control-bar>
									</media-controller>

									<span v-else class="text-light-100"
										>Sorry but this file can't be previewd at this time.</span
									>
								</div>

								<!-- File information panel -->
								<div class="flex flex-col w-1/3 pl-4 mobile:w-full">
									<div class="flex justify-between mobile:mt-4 gap-2">
										<Button class="flex-1" @click="copyLink">{{
											isCopying ? 'Copied!' : 'Copy link'
										}}</Button>
										<Button
											as="a"
											:href="file.url"
											target="_blank"
											rel="noopener noreferrer"
											class="flex-1"
										>
											Open
										</Button>
										<ConfirmationDialog
											v-if="props.type === 'admin' && !file.quarantine"
											title="Quarantine file"
											message="The file will be quarantined and gone temporarily. Are you sure?"
											proceedText="Quarantine"
											:callback="doQuarantineFile"
											><Button>Quarantine</Button></ConfirmationDialog
										>
										<ConfirmationDialog
											v-if="props.type === 'admin' && file.quarantine"
											title="Allow file"
											message="The file will be un-quarantined and be available again. Are you sure?"
											proceedText="Allow"
											:callback="doAllowFile"
											><Button>Allow</Button></ConfirmationDialog
										>
										<ConfirmationDialog
											title="Delete file"
											message="The file will be deleted and gone forever with no way to recover it. It will also remove it from any albums that you added it to. Are you sure?"
											proceedText="Delete"
											:callback="doDeleteFile"
											><Button>Delete</Button></ConfirmationDialog
										>
									</div>

									<h2 class="text-light-100 mt-1">File info</h2>

									<InputWithOverlappingLabel :value="file.uuid" class="mt-4" label="UUID" readOnly />
									<InputWithOverlappingLabel :value="file.name" class="mt-4" label="Name" readOnly />
									<InputWithOverlappingLabel
										:value="file.original"
										class="mt-4"
										label="Original Name"
										readOnly
									/>
									<InputWithOverlappingLabel
										:value="file.ip"
										class="mt-4"
										label="IP"
										type="link"
										:href="`/dashboard/admin/ip/${file.ip}`"
										readOnly
									/>
									<InputWithOverlappingLabel
										:value="file.url"
										class="mt-4"
										label="Link"
										type="link"
										:href="file.url"
										readOnly
									/>
									<InputWithOverlappingLabel
										:value="String(formatBytes(file.size))"
										class="mt-4"
										label="Size"
										readOnly
									/>
									<InputWithOverlappingLabel :value="file.hash" class="mt-4" label="Hash" readOnly />
									<InputWithOverlappingLabel
										:value="dayjs(file.createdAt).format('MMMM D, YYYY h:mm A')"
										class="mt-4"
										label="Uploaded"
										readOnly
									/>

									<!-- Albums and Tags information section -->
									<template v-if="props.type !== 'admin'">
										<!-- Tags section -->
										<!--
										  <h2 class="text-light-100 mt-8 mb-4">Tags</h2>
										  <CreateTag class="mb-4" :fileUuid="null" />
										  <Tag text="test" />
										-->

										<!-- Albums section -->
										<h2 class="text-light-100 mt-8 mb-4">Albums</h2>
										<ul
											class="w-full max-h-[540px] text-sm font-medium rounded-lg border bg-dark-110 border-dark-90 text-white overflow-y-auto"
										>
											<li
												v-for="album in albums"
												:key="album.uuid"
												class="w-full rounded-t-lg border-b border-dark-90"
											>
												<div class="flex items-center pl-3">
													<input
														:id="album.uuid"
														type="checkbox"
														value=""
														:checked="album.selected"
														class="w-4 h-4 text-blue-600 rounded focus:ring-0 checked:bg-blue-500 focus:ring-blue-600 ring-offset-gray-700 bg-dark-90 border-gray-500"
														@change="clickedAlbum(!album.selected, album.uuid)"
													/>
													<label
														:for="album.uuid"
														class="py-3 ml-2 w-full text-sm font-medium text-gray-300"
														>{{ album.name }}</label
													>
												</div>
											</li>
										</ul>
									</template>
									<!-- Albums and Tags information section -->

									<!-- User information section -->
									<template v-else>
										<h2 class="text-light-100 mt-8">User info</h2>
										<InputWithOverlappingLabel
											:value="file.user?.username"
											class="mt-4"
											label="Username"
											readOnly
											type="link"
											:href="`/dashboard/admin/user/${file.user?.uuid}`"
										/>
										<InputWithOverlappingLabel
											:value="file.user?.uuid"
											class="mt-4"
											label="UUID"
											readOnly
										/>
										<InputWithOverlappingLabel
											:value="String(file.user?.enabled)"
											class="mt-4"
											label="Enabled"
											readOnly
										/>
										<InputWithOverlappingLabel
											:value="String(file.user?.roles.map(role => role.name).join(', '))"
											class="mt-4"
											label="Roles"
											readOnly
										/>
										<InputWithOverlappingLabel
											:value="dayjs(file.user?.createdAt).format('MMMM D, YYYY h:mm A')"
											class="mt-4"
											label="Created at"
											readOnly
										/>
									</template>
									<!-- User information section -->
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
import { TransitionRoot, TransitionChild, Dialog, DialogOverlay } from '@headlessui/vue';
import { useQueryClient, useMutation } from '@tanstack/vue-query';
import { useClipboard } from '@vueuse/core';
import dayjs from 'dayjs';
import { ref, computed, watch } from 'vue';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import ConfirmationDialog from '~/components/dialogs/ConfirmationDialog.vue';
import InputWithOverlappingLabel from '~/components/forms/InputWithOverlappingLabel.vue';
import { useModalStore, useAlbumsStore, useFilesStore } from '~/store';
import type { AlbumWithSelected } from '~/types';
import {
	addFileToAlbum,
	removeFileFromAlbum,
	deleteFile,
	deleteFileAsAdmin,
	allowFileAsAdmin,
	quarantineFileAsAdmin
} from '~/use/api';
import { formatBytes, isFileVideo, isFileImage, isFileAudio } from '~/use/file';

const props = defineProps<{
	type: 'admin' | null;
}>();

const modalsStore = useModalStore();
const albumsStore = useAlbumsStore();
const filesStore = useFilesStore();

const queryClient = useQueryClient();

const { mutate: mutateDeleteFile } = useMutation({
	mutationFn: (uuid: string) => (isAdmin ? deleteFileAsAdmin(uuid) : deleteFile(uuid))
});

if (props.type !== 'admin') {
	// We only load the albums if the user is not an admin and the owner of the files
	void albumsStore.get();
}

const isModalOpen = computed(() => modalsStore.fileInformation.show);
const file = computed(() => modalsStore.fileInformation.file);
const fileAlbums = computed(() => modalsStore.fileInformation.albums);
const isAdmin = props.type === 'admin';

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
	// If the admin is loading this component we early exit to prevent loading the albums
	if (props.type === 'admin' && file.value) {
		return;
	}

	// Otherwise load the albums once the file is loaded
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

const doQuarantineFile = () => {
	if (!file.value) return;

	// If the user is an admin, we need to use the admin endpoint
	void quarantineFileAsAdmin(file.value.uuid);

	filesStore.removeFile(file.value.uuid);
	toast.success('File quarantined');
	closeModal();
};

const doAllowFile = () => {
	if (!file.value) return;

	// If the user is an admin, we need to use the admin endpoint
	void allowFileAsAdmin(file.value.uuid);

	filesStore.removeFile(file.value.uuid);
	toast.success('File allowed');
	closeModal();
};

const doDeleteFile = () => {
	if (!file.value) return;

	mutateDeleteFile(file.value.uuid, {
		onSuccess: () => {
			queryClient.invalidateQueries(['files']);
			toast.success('File deleted');
			closeModal();
		}
	});
};
</script>
