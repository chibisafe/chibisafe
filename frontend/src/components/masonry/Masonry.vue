<template>
	<div v-if="files?.length" class="masonry mt-8 pb-16">
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
				<span class="text-dark-100 dark:text-light-100 mt-4 text-lg text-center">{{
					file.original.length > 60 ? `${file.original.substring(0, 40)}...` : file.original
				}}</span>
			</div>
		</div>
	</div>
	<FileInformationModal :type="props.type === 'admin' ? 'admin' : null" />
</template>

<script setup lang="ts">
import type { FileWithAdditionalData } from '~/types';
import { computed, ref } from 'vue';
import { vElementHover } from '@vueuse/components';
import { useFilesStore } from '~/store/files';
import { useAlbumsStore } from '~/store/albums';
import { useModalstore } from '~/store/modals';
import { isFileVideo, isFileImage, isFileAudio, isFilePDF } from '~/use/file';
import FileInformationModal from '~/components/modals/FileInformationModal.vue';
import IconVideo from '~icons/carbon/video-filled';
import IconDocument from '~icons/carbon/document';
import IconPdf from '~icons/carbon/document-pdf';
import IconAudio from '~icons/carbon/document-audio';

const props = defineProps<{
	type: 'admin' | 'album' | 'uploads';
}>();

const filesStore = useFilesStore();
const albumsStore = useAlbumsStore();
const modalsStore = useModalstore();

const files = computed(() => {
	if (props.type === 'uploads' || props.type === 'admin') return filesStore.files;
	else if (props.type === 'album') return albumsStore.album?.files;
	else return [];
});

const isHovered = ref<any>({});
function onHover(state: boolean, uuid: string) {
	isHovered.value[uuid] = state;
}

const showModal = (file: FileWithAdditionalData) => {
	modalsStore.fileInformation.file = file;
	modalsStore.fileInformation.show = true;
};
</script>
