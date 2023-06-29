<template>
	<div v-if="files?.length" class="masonry mt-8 pb-16">
		<div v-for="file in files" :key="file.uuid" class="bg-black">
			<div class="hover:-translate-y-1 hover:translate-x-1 transition-transform duration-100 ease-in-out">
				<template v-if="isFileImage(file) || isFileVideo(file)">
					<a
						:href="file.url"
						target="_blank"
						rel="noopener noreferrer"
						@click.left.stop="event => showModal(file, event)"
					>
						<img
							v-element-hover="(value: boolean) => onHover(value, file.uuid)"
							:src="file.thumb"
							class="cursor-pointer w-full min-w-[160px]"
							onerror="this.classList.add('min-h-[160px]');"
						/>
					</a>

					<video
						v-if="isFileVideo(file) && isHovered[file.uuid]"
						class="preview absolute top-0 left-0 w-full h-full pointer-events-none min-w-[160px]"
						autoplay
						loop
						muted
					>
						<source :src="file.preview" type="video/mp4" />
					</video>

					<VideoIcon v-if="isFileVideo(file)" class="absolute bottom-1 right-1 w-6 h-6 text-light-100" />
				</template>
				<div
					v-else
					class="w-full h-40 bg-dark-90 flex flex-col justify-center items-center cursor-pointer"
					@click="showModal(file)"
				>
					<FileAudioIcon v-if="isFileAudio(file)" class="text-dark-100 dark:text-light-100 w-16 h-16" />
					<FileTextIcon v-else-if="isFilePDF(file)" class="text-dark-100 dark:text-light-100 w-16 h-16" />
					<FileIcon v-else class="text-dark-100 dark:text-light-100 w-16 h-16" />
					<span class="text-dark-100 dark:text-light-100 mt-4 text-lg text-center">{{
						file.original.length > 60 ? `${file.original.substring(0, 40)}...` : file.original
					}}</span>
				</div>
			</div>
		</div>
	</div>
	<FileInformationModal :type="props.type === 'admin' ? 'admin' : null" />
</template>

<script setup lang="ts">
import type { FileWithAdditionalData } from '~/types';
import { computed, ref } from 'vue';
import { vElementHover } from '@vueuse/components';
import { VideoIcon, FileIcon, FileTextIcon, FileAudioIcon, UnlinkIcon } from 'lucide-vue-next';
import { useFilesStore, useAlbumsStore, useModalStore } from '~/store';
import { isFileVideo, isFileImage, isFileAudio, isFilePDF } from '~/use/file';
import FileInformationModal from '~/components/modals/FileInformationModal.vue';

const props = defineProps<{
	type?: 'admin' | 'album' | 'uploads';
}>();

const filesStore = useFilesStore();
const albumsStore = useAlbumsStore();
const modalsStore = useModalStore();

const files = computed(() => {
	if (props.type === 'uploads' || props.type === 'admin') return filesStore.files;
	else if (props.type === 'album') return albumsStore.album?.files;
	else return [];
});

const isHovered = ref<any>({});
function onHover(state: boolean, uuid: string) {
	isHovered.value[uuid] = state;
}

const showModal = (file: FileWithAdditionalData, event?: MouseEvent) => {
	event?.preventDefault();
	modalsStore.fileInformation.file = file;
	modalsStore.fileInformation.show = true;
};
</script>
