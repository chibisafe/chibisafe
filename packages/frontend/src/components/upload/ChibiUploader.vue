<template>
	<div
		class="w-80 h-80 max-h-[320px] max-w-[320px] absolute mobile:relative right-0 top-0 mobile:h-16"
		:class="[isUploadEnabled && isMobile ? 'mb-12' : '']"
	>
		<div
			id="upload"
			class="absolute w-full h-full right-0 top-0 bg-[#181a1b] rounded-3xl mobile:rounded-lg border-4 shadow-lg flex items-center justify-center mobile:justify-start blueprint flex-col cursor-pointer hover:border-[#3b3e40] transform-gpu transition-all"
			:class="{
				'border-blue-400': isDragging,
				'border-[#303436]': !isDragging
			}"
			@click="triggerFileInput"
			@drop.prevent="event => dropHandler(event)"
			@dragenter.prevent="onDragStart"
			@dragend.prevent="onDragEnd"
			@dragexit.prevent="onDragEnd"
			@dragleave.prevent="onDragEnd"
			@dragover.prevent
		>
			<template v-if="isUploadEnabled">
				<IconUpload class="h-12 w-12 pointer-events-none mobile:hidden" />
				<h3 class="font-bold text-center mt-4 pointer-events-none">
					<template v-if="isMobile">
						<p class="text-blue-400">
							TAP TO UPLOAD <span class="text-light-100 ml-2">({{ formatBytes(maxFileSize) }} max)</span>
						</p>
					</template>
					<template v-else> DROP FILES OR <br /><span class="text-blue-400">CLICK HERE</span> </template>
				</h3>
				<p class="text-center mt-4 w-3/4 pointer-events-none mobile:hidden">
					Drag and drop your files here. {{ formatBytes(maxFileSize) }} max per file.
				</p>

				<input ref="inputUpload" type="file" class="hidden" multiple @change="onFileChanged($event)" />
			</template>
			<template v-else>
				<h3
					class="text-center mt-4 mobile:mt-0 mobile:w-full mobile:h-full mobile:flex mobile:justify-center mobile:items-center w-3/4 pointer-events-none"
				>
					Upload is disabled without an account
				</h3>
			</template>
		</div>
		<AlbumDropdown v-if="isLoggedIn" class="absolute -bottom-12 w-full" />
	</div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useUserStore, useUploadsStore, useSettingsStore, useAlbumsStore } from '~/store';
import { getFileExtension, formatBytes } from '~/use/file';
import { debug } from '~/use/log';
import { chibiUploader } from '@chibisafe/uploader-client';
import AlbumDropdown from '~/components/dropdown/AlbumDropdown.vue';
// import { chibiUploader } from '../../../../../chibisafe-uploader/packages/uploader-client/lib';

// @ts-ignore
import IconUpload from '~icons/carbon/cloud-upload';
import { useWindowSize } from '@vueuse/core';

const userStore = useUserStore();
const uploadsStore = useUploadsStore();
const settingsStore = useSettingsStore();
const albumsStore = useAlbumsStore();
const isLoggedIn = computed(() => userStore.user.loggedIn);
const token = computed(() => userStore.user.token);
const files = ref<File[] | null>();
const inputUpload = ref<HTMLInputElement>();
const isDragging = ref(false);

const isUploadEnabled = computed(() => {
	if (settingsStore.publicMode) return true;
	return isLoggedIn.value;
});

const maxFileSize = computed(() => settingsStore.maxFileSize);
const chunkSize = computed(() => settingsStore.chunkSize);
const isMobile = computed(() => useWindowSize().width.value < 640);

const triggerFileInput = () => {
	inputUpload.value?.click();
};

const dropHandler = (event: DragEvent) => {
	if (!isUploadEnabled.value) return;
	if (!event.dataTransfer) return;
	for (const file of Array.from(event.dataTransfer.files)) {
		const fileData = new File([file], file.name, {
			type: file.type
		});

		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		void processFile(fileData);
	}

	onDragEnd();
};

const pasteHandler = (event: ClipboardEvent) => {
	if (!event.clipboardData) return;
	for (const file of Array.from(event.clipboardData.files)) {
		if (!file?.type) continue;

		const fileData = new File([file], `pasted-file.${getFileExtension(file)}`, {
			type: file.type
		});

		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		void processFile(fileData);
	}
};

const processFile = async (file: File) => {
	files.value?.push(file);
	await chibiUploader({
		// @ts-ignore
		debug: !import.meta.env.PROD,
		endpoint: '/api/upload',
		file,
		maxFileSize: maxFileSize.value,
		chunkSize: chunkSize.value,
		postParams: {
			name: file.name,
			type: file.type,
			// @ts-ignore
			size: file.size
		},
		headers: {
			authorization: token.value ? `Bearer ${token.value}` : '',
			albumuuid: isLoggedIn.value
				? albumsStore.selectedAlbumForUpload
					? albumsStore.selectedAlbumForUpload
					: ''
				: ''
		},
		onStart: (uuid: string, totalChunks: number) => {
			debug(`Started uploading ${file.name} with uuid ${uuid} and ${totalChunks} chunks`);
			uploadsStore.addFile({
				uuid,
				name: file.name,
				type: file.type,
				processing: true,
				status: 'uploading',
				bytesSent: 0,
				bytesTotal: file.size,
				progress: 0,
				url: ''
			});
		},
		onError: (uuid: string, error: any) => {
			debug(`Error uploading ${file.name} with uuid ${uuid}`, error.message);
			uploadsStore.setError(uuid, error.message);
		},
		onProgress: (uuid: string, progress: any) => {
			uploadsStore.updateProgess(uuid, progress, 0);
		},
		onRetry: (uuid: string, reason: any) => {
			console.log('onRetry', reason);
		},
		onFinish: (uuid: string, response: any) => {
			debug('Finished uploading file', {
				name: file.name,
				uuid,
				url: response.url
			});
			uploadsStore.setCompleted(uuid, response.url);
		}
	});
};

const onFileChanged = ($event: Event) => {
	const target = $event.target as HTMLInputElement;
	if (target?.files) {
		// eslint-disable-next-line @typescript-eslint/prefer-for-of
		for (let i = 0; i < target.files.length; i++) {
			void processFile(target.files[i]);
		}
	}
};

const onDragStart = () => {
	isDragging.value = true;
};

const onDragEnd = () => {
	isDragging.value = false;
};

onMounted(() => {
	// @ts-ignore
	window.addEventListener('paste', pasteHandler);
});

onUnmounted(() => {
	// @ts-ignore
	window.removeEventListener('paste', pasteHandler);
});
</script>
