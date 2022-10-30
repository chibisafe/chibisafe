<template>
	<Sidebar>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-screen overflow-auto">
			<h1 class="text-2xl mt-8 font-semibold text-light-100">Uploads ({{ totalFiles }} files)</h1>
			<div class="masonry mt-8 pb-16">
				<div v-for="file in files" :key="file.uuid">
					<template v-if="isFileImage(file) || isFileVideo(file)">
						<img
							v-element-hover="(value: boolean) => onHover(value, file.uuid)"
							:src="file.thumb"
							class="cursor-pointer w-full"
							@click="showModal(file)"
						/>

						<video
							v-if="isHovered[file.uuid]"
							class="preview absolute top-0 left-0 w-full h-full pointer-events-none"
							autoplay
							loop
							muted
						>
							<source :src="file.preview" type="video/mp4" />
						</video>

						<IconVideo v-if="isFileVideo(file)" class="absolute bottom-1 right-1 w-6 h-6 text-light-100" />
					</template>
					<div
						v-else
						class="w-full h-40 bg-dark-90 flex flex-col justify-center items-center cursor-pointer"
						@click="showModal(file)"
					>
						<IconAudio v-if="isFileAudio(file)" class="text-dark-100 dark:text-light-100 w-16 h-16" />
						<IconPdf v-else-if="isFilePDF(file)" class="text-dark-100 dark:text-light-100 w-16 h-16" />
						<IconDocument v-else class="text-dark-100 dark:text-light-100 w-16 h-16" />
						<span class="text-dark-100 dark:text-light-100 mt-4 text-lg">{{ file.original }}</span>
					</div>
				</div>
			</div>
		</div>
	</Sidebar>
	<FileInformationModal />
</template>

<script setup lang="ts">
import type { FileWithAdditionalData } from '~/types';
import { computed, ref } from 'vue';
import { vElementHover } from '@vueuse/components';
import { useFilesStore } from '~/store/files';
import { useModalstore } from '~/store/modals';
import { isFileVideo, isFileImage, isFileAudio, isFilePDF } from '~/use/file';
import Sidebar from '~/components/sidebar/Sidebar.vue';
import FileInformationModal from '~/components/modals/FileInformationModal.vue';

import IconVideo from '~icons/carbon/video-filled';
import IconDocument from '~icons/carbon/document';
import IconPdf from '~icons/carbon/document-pdf';
import IconAudio from '~icons/carbon/document-audio';

const filesStore = useFilesStore();
const modalsStore = useModalstore();
const files = computed(() => filesStore.files);
const totalFiles = computed(() => filesStore.count);

const isHovered = ref<any>({});
function onHover(state: boolean, uuid: string) {
	isHovered.value[uuid] = state;
}

const showModal = (file: FileWithAdditionalData) => {
	modalsStore.fileInformation.file = file;
	modalsStore.fileInformation.show = true;
};

void filesStore.get();
</script>
