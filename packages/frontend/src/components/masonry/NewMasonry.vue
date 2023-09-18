<template>
	<div
		ref="MiniMasonryContainer"
		class="mt-8 pb-16 relative"
		:class="[hasLayoutBeenRefreshed ? 'visible' : 'invisible']"
	>
		<div v-for="file in files" :key="file.uuid" class="bg-black mb-4 absolute min-w-[255px]">
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
					<span class="text-light-100 mt-4 text-lg text-center">{{
						file.original.length > 60 ? `${file.original.substring(0, 40)}...` : file.original
					}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, nextTick } from 'vue';
import { vElementHover } from '@vueuse/components';
import { VideoIcon, FileIcon, FileTextIcon, FileAudioIcon, FileWarningIcon } from 'lucide-vue-next';
import { useFilesStore, useAlbumsStore } from '~/store';
import { isFileVideo, isFileImage, isFileAudio, isFilePDF } from '~/use/file';
import FileInformationDialog from '@/components/dialogs/FileInformationDialog.vue';
// @ts-ignore
import MiniMasonry from 'minimasonry';
import { debug } from '@/use/log';

const props = defineProps<{
	type?: 'admin' | 'album' | 'uploads';
}>();

const filesStore = useFilesStore();
const albumsStore = useAlbumsStore();
const MiniMasonryContainer = ref<HTMLElement>();
const masonryInstance = ref<MiniMasonry>();
const debounceTimer = ref<any>();
const hasLayoutBeenRefreshed = ref(false);

const files = computed(() => {
	if (props.type === 'uploads' || props.type === 'admin') return filesStore.files;
	else if (props.type === 'album') return albumsStore.album?.files;
	else return [];
});

watch(files, async () => {
	await nextTick();
	findImages();
});

onMounted(async () => {
	masonryInstance.value = new MiniMasonry({
		container: MiniMasonryContainer.value,
		baseWidth: 225,
		gutter: 16
	});

	findImages();
});

const findImages = () => {
	const images = MiniMasonryContainer.value?.querySelectorAll('img');
	if (!images) return;
	for (const img of Array.from(images)) {
		const onLoad = () => {
			updateLayout();
			img.removeEventListener('load', onLoad);
		};

		img.addEventListener('load', onLoad);
	}
};

const updateLayout = () => {
	if (debounceTimer.value) window.clearTimeout(debounceTimer.value);

	debounceTimer.value = window.setTimeout(() => {
		debug('Updating MiniMasonry layout');
		masonryInstance.value.layout();
		hasLayoutBeenRefreshed.value = true;
	}, 250);
};

const isHovered = ref<any>({});
function onHover(state: boolean, uuid: string) {
	isHovered.value[uuid] = state;
}
</script>
