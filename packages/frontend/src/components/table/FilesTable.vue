<template>
	<table class="min-w-full divide-y divide-gray-500 mb-5">
		<thead class="bg-dark-80">
			<tr>
				<th
					scope="col"
					class="py-3.5 pl-4 pr-3 text-sm font-semibold text-dark-90 dark:text-light-100 desktop:pl-6 text-center w-24"
				>
					Thumb
				</th>
				<th
					scope="col"
					class="px-3 py-3.5 text-sm font-semibold text-dark-90 dark:text-light-100 desktop:table-cell text-center"
				>
					Link
				</th>
				<!--
				  <th
				  scope="col"
				  class="hidden px-3 py-3.5 text-left text-sm font-semibold text-dark-90 dark:text-light-100 desktop:table-cell"
				  >
				  Uploader
				  </th>
				-->
				<th
					scope="col"
					class="hidden px-3 py-3.5 text-left text-sm font-semibold text-dark-90 dark:text-light-100 desktop:table-cell"
				>
					Size
				</th>
				<th
					scope="col"
					class="hidden px-3 py-3.5 text-left text-sm font-semibold text-dark-90 dark:text-light-100 desktop:table-cell"
				>
					Created
				</th>
				<th
					scope="col"
					class="px-3 py-3.5 text-left text-sm font-semibold text-dark-90 dark:text-light-100 desktop:table-cell"
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
					class="w-full px-3 py-4 pl-4 pr-3 font-normal text-dark-90 dark:text-light-100 desktop:w-auto desktop:max-w-none desktop:pl-6 cursor-pointer flex justify-center"
					@click="showModal(file)"
				>
					<template v-if="isFileImage(file) || isFileVideo(file)">
						<img :src="file.thumb" class="h-10" />
					</template>
					<IconAudio v-else-if="isFileAudio(file)" class="text-dark-100 dark:text-light-100 w-16 h-16" />
					<IconPdf v-else-if="isFilePDF(file)" class="text-dark-100 dark:text-light-100 w-16 h-16" />
					<IconDocument v-else class="text-dark-100 dark:text-light-100 w-16 h-16" />
				</td>
				<td class="px-3 py-4 text-sm text-dark-90 dark:text-light-100 desktop:table-cell underline text-center">
					<a :href="file.url" target="_blank" rel="noopener noreferrer">{{ file.name }}</a>
				</td>
				<!--
				  <td class="hidden px-3 py-4 text-sm text-dark-90 dark:text-light-100 desktop:table-cell">
				  {{ file.uploader }}
				  </td>
				-->
				<td class="hidden px-3 py-4 text-sm text-dark-90 dark:text-light-100 desktop:table-cell">
					{{ formatBytes(Number(file.size)) }}
				</td>
				<td class="hidden px-3 py-4 text-sm text-dark-90 dark:text-light-100 desktop:table-cell">
					{{ dayjs(file.createdAt).format('MMMM D, YYYY h:mm A') }}
				</td>
				<td class="py-4 pl-3 pr-4 text-right text-sm font-medium desktop:pr-6 text-dark-90 dark:text-light-100">
					<button type="button" class="ml-4" @click="showDeleteFileModal(file)">Delete</button>
				</td>
			</tr>
		</tbody>
	</table>
	<FileInformationModal :type="props.type === 'admin' ? 'admin' : null" />
	<DeleteFileModal />
</template>

<script setup lang="ts">
import type { FileWithAdditionalData } from '~/types';
import { computed } from 'vue';
import { useFilesStore, useAlbumsStore, useModalStore } from '~/store';
import { isFileVideo, isFileImage, isFileAudio, isFilePDF, formatBytes } from '~/use/file';
import dayjs from 'dayjs';

import FileInformationModal from '~/components/modals/FileInformationModal.vue';
import DeleteFileModal from '~/components/modals/DeleteFileModal.vue';
import IconDocument from '~icons/carbon/document';
import IconPdf from '~icons/carbon/document-pdf';
import IconAudio from '~icons/carbon/document-audio';

const props = defineProps<{
	type: 'admin' | 'album' | 'uploads';
}>();

const filesStore = useFilesStore();
const albumsStore = useAlbumsStore();
const modalsStore = useModalStore();

const files = computed(() => {
	if (props.type === 'uploads' || props.type === 'admin') return filesStore.files;
	else if (props.type === 'album') return albumsStore.album?.files;
	else return [];
});

const showDeleteFileModal = (file: FileWithAdditionalData | null) => {
	if (!file) return;
	// If the user is an admin we want to delete it through another endpoint
	if (props.type === 'admin') {
		modalsStore.deleteFile.admin = true;
	}

	modalsStore.deleteFile.file = file;
	modalsStore.deleteFile.show = true;
};

const showModal = (file: FileWithAdditionalData) => {
	modalsStore.fileInformation.file = file;
	modalsStore.fileInformation.show = true;
};
</script>
