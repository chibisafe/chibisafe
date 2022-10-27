<template>
	<Sidebar>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-screen overflow-auto">
			<h1 class="text-2xl mt-8 font-semibold text-light-100">Uploads ({{ totalFiles }} files)</h1>
			<div class="masonry mt-8 pb-16">
				<div v-for="file in files" :key="file.uuid">
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
import { isFileVideo } from '~/use/file';
import Sidebar from '~/components/sidebar/Sidebar.vue';
import FileInformationModal from '~/components/modals/FileInformationModal.vue';

import IconVideo from '~icons/carbon/video-filled';

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
