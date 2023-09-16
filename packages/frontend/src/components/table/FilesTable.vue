<template>
	<table class="min-w-full divide-y divide-gray-500 mb-5">
		<thead class="bg-dark-80">
			<tr>
				<th
					scope="col"
					class="py-3.5 pl-4 pr-3 text-sm font-semibold text-light-100 desktop:pl-6 text-center w-24"
				>
					Thumb
				</th>
				<th scope="col" class="px-3 py-3.5 text-sm font-semibold text-light-100 desktop:table-cell text-center">
					Link
				</th>
				<!--
				  <th
				  scope="col"
				  class="hidden px-3 py-3.5 text-left text-sm font-semibold text-light-100 desktop:table-cell"
				  >
				  Uploader
				  </th>
				-->
				<th
					scope="col"
					class="hidden px-3 py-3.5 text-left text-sm font-semibold text-light-100 desktop:table-cell"
				>
					Size
				</th>
				<th
					scope="col"
					class="hidden px-3 py-3.5 text-left text-sm font-semibold text-light-100 desktop:table-cell"
				>
					Created
				</th>
				<th
					scope="col"
					class="px-3 py-3.5 text-left text-sm font-semibold text-light-100 desktop:table-cell"
				></th>
			</tr>
		</thead>
		<tbody class="divide-y divide-gray-500">
			<tr
				v-for="(file, indexFile) in files"
				:key="file.uuid"
				:class="indexFile % 2 === 0 ? ' bg-dark-90' : 'bg-dark-80'"
			>
				<td
					class="w-full px-3 py-4 pl-4 pr-3 font-normal text-light-100 desktop:w-auto desktop:max-w-none desktop:pl-6 cursor-pointer flex justify-center"
					@click="showModal(file)"
				>
					<template v-if="isFileImage(file) || isFileVideo(file)">
						<img :src="file.thumb" class="h-10" />
					</template>
					<FileAudioIcon v-else-if="isFileAudio(file)" class="text-light-100 w-16 h-16" />
					<FileTextIcon v-else-if="isFilePDF(file)" class="text-light-100 w-16 h-16" />
					<FileIcon v-else class="text-light-100 w-16 h-16" />
				</td>
				<td class="px-3 py-4 text-sm text-light-100 desktop:table-cell underline text-center">
					<a :href="file.url" target="_blank" rel="noopener noreferrer">{{ file.name }}</a>
				</td>
				<!--
				  <td class="hidden px-3 py-4 text-sm text-light-100 desktop:table-cell">
				  {{ file.uploader }}
				  </td>
				-->
				<td class="hidden px-3 py-4 text-sm text-light-100 desktop:table-cell">
					{{ formatBytes(Number(file.size)) }}
				</td>
				<td class="hidden px-3 py-4 text-sm text-light-100 desktop:table-cell">
					{{ dayjs(file.createdAt).format('MMMM D, YYYY h:mm A') }}
				</td>
				<td
					class="py-4 pl-3 pr-4 text-right text-sm font-medium desktop:pr-6 text-light-100"
					@click="prepareDeleteFile(file)"
				>
					<ConfirmationDialog
						title="Delete file"
						message="The file will be deleted and gone forever with no way to recover it. It will also remove it from any albums that you added it to. Are you sure?"
						proceedText="Delete"
						:callback="doDeleteFile"
						variant="destructive"
						>Delete</ConfirmationDialog
					>
				</td>
			</tr>
		</tbody>
	</table>
	<FileInformationModal :type="props.type === 'admin' ? 'admin' : null" />
</template>

<script setup lang="ts">
import type { FileWithAdditionalData } from '~/types';
import { computed, ref } from 'vue';
import { useModalStore, useUserStore, useFilesStore, useAlbumsStore } from '~/store';
import { isFileVideo, isFileImage, isFileAudio, isFilePDF, formatBytes } from '~/use/file';
import { FileIcon, FileTextIcon, FileAudioIcon } from 'lucide-vue-next';
import dayjs from 'dayjs';
import { deleteFileAsAdmin, deleteFile } from '~/use/api';
import { toast } from 'vue-sonner';

import FileInformationModal from '~/components/modals/FileInformationModal.vue';
import ConfirmationDialog from '~/components/dialogs/ConfirmationDialog.vue';

const props = defineProps<{
	type: 'admin' | 'album' | 'uploads';
}>();

const filesStore = useFilesStore();
const albumsStore = useAlbumsStore();
const userStore = useUserStore();
const modalsStore = useModalStore();
const isAdmin = computed(() => userStore.user.roles?.find(role => role.name === 'admin'));
const fileToDelete = ref<FileWithAdditionalData | null>(null);

const files = computed(() => {
	if (props.type === 'uploads' || props.type === 'admin') return filesStore.files;
	else if (props.type === 'album') return albumsStore.album?.files;
	else return [];
});

const prepareDeleteFile = (file: FileWithAdditionalData) => {
	if (!file) return;
	fileToDelete.value = file;
};

const showModal = (file: FileWithAdditionalData) => {
	modalsStore.fileInformation.file = file;
	modalsStore.fileInformation.show = true;
};

const doDeleteFile = () => {
	if (!fileToDelete.value) return;

	// If the user is an admin, we need to use the admin endpoint
	if (isAdmin.value) void deleteFileAsAdmin(fileToDelete.value.uuid);
	// Otherwise, we can use the normal endpoint
	else void deleteFile(fileToDelete.value.uuid);

	filesStore.removeFile(fileToDelete.value.uuid);
	toast.success('File deleted');
};
</script>
