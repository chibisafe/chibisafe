<template>
	<div v-if="files?.length" class="masonry mt-8 pb-16">
		<div v-for="file in files" :key="file.uuid">
			<a :href="file.url" target="_blank" rel="noopener noreferrer">
				<template v-if="isFileImage(file) || isFileVideo(file)">
					<img
						v-element-hover="(value: boolean) => onHover(value, file.uuid)"
						:src="file.thumb"
						class="cursor-pointer w-full"
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

					<VideoIcon v-if="isFileVideo(file)" class="absolute bottom-1 right-1 w-6 h-6 text-light-100" />
				</template>
				<div v-else class="w-full h-40 bg-dark-90 flex flex-col justify-center items-center cursor-pointer">
					<FileAudioIcon v-if="isFileAudio(file)" class="text-dark-100 dark:text-light-100 w-16 h-16" />
					<FileTextIcon v-else-if="isFilePDF(file)" class="text-dark-100 dark:text-light-100 w-16 h-16" />
					<FileIcon v-else class="text-dark-100 dark:text-light-100 w-16 h-16" />
					<span class="text-dark-100 dark:text-light-100 mt-4 text-lg">{{ file.original }}</span>
				</div>
			</a>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { vElementHover } from '@vueuse/components';
import { useFilesStore } from '~/store/files';
import { isFileVideo, isFileImage, isFileAudio, isFilePDF } from '~/use/file';
import { VideoIcon, FileIcon, FileTextIcon, FileAudioIcon } from 'lucide-vue-next';

const filesStore = useFilesStore();
const files = computed(() => filesStore.files);

const isHovered = ref<any>({});
function onHover(state: boolean, uuid: string) {
	isHovered.value[uuid] = state;
}
</script>
