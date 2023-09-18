<template>
	<div ref="MasonryContainer" class="mt-8 pb-16 flex justify-center">
		<div v-for="(column, i) in fileColumns" :key="i">
			<div v-for="file in column" :key="file.uuid" class="bg-black mb-4 m-2 relative">
				<FileInformationDialog :file="file" />
				<div class="hover:-translate-y-1 hover:translate-x-1 transition-transform duration-100 ease-in-out">
					<div
						v-if="file.quarantine"
						class="w-full h-40 bg-dark-90 flex flex-col justify-center items-center cursor-pointer"
					>
						<FileWarningIcon class="text-red-500 w-16 h-16" />
					</div>
					<template v-else-if="isFileImage(file) || isFileVideo(file)">
						<img
							v-element-hover="(value: boolean) => onHover(value, file.uuid)"
							:src="file.thumb"
							class="cursor-pointer w-full min-w-[160px]"
							onerror="this.classList.add('min-h-[160px]');"
						/>

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

					<div v-else class="h-40 bg-dark-90 flex flex-col justify-center items-center cursor-pointer">
						<FileAudioIcon v-if="isFileAudio(file)" class="text-light-100 w-16 h-16" />
						<FileTextIcon v-else-if="isFilePDF(file)" class="text-light-100 w-16 h-16" />
						<FileIcon v-else class="text-light-100 w-16 h-16" />
						<span class="text-light-100 mt-4 text-lg text-center break-all w-[160px]">{{
							file.original.length > 60 ? `${file.original.substring(0, 40)}...` : file.original
						}}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { vElementHover } from '@vueuse/components';
import { VideoIcon, FileIcon, FileTextIcon, FileAudioIcon, FileWarningIcon } from 'lucide-vue-next';
import { useFilesStore, useAlbumsStore } from '~/store';
import { isFileVideo, isFileImage, isFileAudio, isFilePDF } from '~/use/file';
import FileInformationDialog from '@/components/dialogs/FileInformationDialog.vue';

const props = defineProps<{
	type?: 'admin' | 'album' | 'uploads';
}>();

const filesStore = useFilesStore();
const albumsStore = useAlbumsStore();
const MasonryContainer = ref();

const files = computed(() => {
	if (props.type === 'uploads' || props.type === 'admin') return filesStore.files;
	else if (props.type === 'album') return albumsStore.album?.files;
	else return [];
});

const numberOfColumns = ref(5);

const fileColumns = computed(() => {
	const columns: any[] = Array.from({ length: numberOfColumns.value }).map(() => []);
	// @ts-ignore
	for (const [i, file] of files.value.entries()) {
		columns[i % numberOfColumns.value].push(file);
	}

	return columns;
});

const breakpoints = [450, 552, 736, 920];

let resizeTimer: any;
const resizeHandler = () => {
	// eslint-disable-next-line no-restricted-globals
	clearTimeout(resizeTimer);
	// eslint-disable-next-line no-restricted-globals
	resizeTimer = setTimeout(() => {
		const containerWidth = MasonryContainer.value?.clientWidth ?? 0;

		for (const [index, breakpoint] of breakpoints.entries()) {
			if (containerWidth <= breakpoint) {
				numberOfColumns.value = index + 1;
				return;
			}
		}

		numberOfColumns.value = 5;
	}, 25);
};

onMounted(() => {
	resizeHandler();
	window.addEventListener('resize', resizeHandler);
});

onUnmounted(() => {
	window.removeEventListener('resize', resizeHandler);
});

const isHovered = ref<any>({});
function onHover(state: boolean, uuid: string) {
	isHovered.value[uuid] = state;
}
</script>
