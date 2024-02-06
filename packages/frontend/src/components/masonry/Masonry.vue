<template>
	<div ref="MasonryContainer" class="mt-8 flex justify-center">
		<div v-for="(column, i) in fileColumns" :key="i">
			<div
				v-for="file in column"
				:key="file.uuid ?? file.name"
				v-element-hover="(value: boolean) => onHover(value, file.uuid ?? file.name)"
				class="mb-4 m-2 relative"
			>
				<FileInformationDialog
					v-if="
						(type !== 'publicAlbum' && !file.quarantine) ||
						((type === 'admin' || type === 'quarantine') && file.quarantine)
					"
					:file="file"
					:type="type"
				/>
				<div
					v-if="file.quarantine"
					class="w-[225px] h-40 bg-dark-90 flex flex-col justify-center items-center cursor-not-allowed"
				>
					<FileWarningIcon class="text-red-500 w-16 h-16" />
				</div>
				<template v-else-if="isFileImage(file) || isFileVideo(file)">
					<a
						v-if="type === 'publicAlbum'"
						class="w-full h-full absolute"
						:href="file?.url"
						target="_blank"
						rel="noopener noreferrer"
						variant="none"
					/>
					<img
						:src="file.thumb"
						class="cursor-pointer w-full min-w-[160px]"
						onerror="this.classList.add('min-h-[160px]');"
					/>

					<video
						v-if="isFileVideo(file) && isHovered[file.uuid ?? file.name]"
						class="preview absolute top-0 left-0 w-full h-full pointer-events-none min-w-[160px]"
						autoplay
						loop
						muted
					>
						<source :src="file.preview" type="video/mp4" />
					</video>

					<VideoIcon
						v-if="isFileVideo(file)"
						class="absolute bottom-1 right-1 w-6 h-6 text-light-100 pointer-events-none"
					/>
				</template>

				<div v-else class="h-40 bg-dark-90 flex flex-col justify-center items-center cursor-pointer">
					<a
						v-if="type === 'publicAlbum'"
						class="w-full h-full absolute"
						:href="file?.url"
						target="_blank"
						rel="noopener noreferrer"
						variant="none"
					/>
					<FileAudioIcon v-if="isFileAudio(file)" class="text-light-100 w-16 h-16" />
					<FileTextIcon v-else-if="isFilePDF(file)" class="text-light-100 w-16 h-16" />
					<FileIcon v-else class="text-light-100 w-16 h-16" />
					<span v-if="file.original" class="text-light-100 mt-4 text-lg text-center break-all w-[160px]">{{
						file.original.length > 60 ? `${file.original.substring(0, 40)}...` : file.original
					}}</span>
					<span v-else class="text-light-100 mt-4 text-lg text-center break-all w-[160px]">{{
						file.name.length > 60 ? `${file.name.substring(0, 40)}...` : file.name
					}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { vElementHover } from '@vueuse/components';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { VideoIcon, FileIcon, FileTextIcon, FileAudioIcon, FileWarningIcon } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';
import FileInformationDialog from '@/components/dialogs/FileInformationDialog.vue';
import { FileWithAdditionalData, FilePropsType } from '@/types';
import { isFileVideo, isFileImage, isFileAudio, isFilePDF } from '~/use/file';

const props = defineProps<{
	// eslint-disable-next-line vue/no-unused-properties
	type?: FilePropsType;
	files: FileWithAdditionalData[];
}>();

const MasonryContainer = ref();
const numberOfColumns = ref(5);

const fileColumns = computed(() => {
	const columns: FileWithAdditionalData[][] = Array.from({ length: numberOfColumns.value }).map(() => []);
	for (const [i, file] of props.files.entries()) {
		columns[i % numberOfColumns.value]?.push(file);
	}

	return columns;
});

const breakpoints = useBreakpoints(breakpointsTailwind);

watch(
	[breakpoints.sm, breakpoints.md, breakpoints.lg, breakpoints.xl, breakpoints['2xl']],
	() => {
		if (breakpoints.isSmallerOrEqual('sm')) {
			numberOfColumns.value = 1;
		} else if (breakpoints.isInBetween('md', 'lg')) {
			numberOfColumns.value = 2;
		} else if (breakpoints.isInBetween('lg', 'xl')) {
			numberOfColumns.value = 3;
		} else if (breakpoints.isInBetween('xl', '2xl')) {
			numberOfColumns.value = 4;
		} else if (breakpoints.isGreaterOrEqual('2xl')) {
			numberOfColumns.value = 5;
		}
	},
	{ immediate: true }
);

const isHovered = ref<any>({});
function onHover(state: boolean, uuid: string) {
	isHovered.value[uuid] = state;
}
</script>
