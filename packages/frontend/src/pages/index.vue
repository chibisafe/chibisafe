<template>
	<div class="h-screen w-full overflow-auto">
		<div class="flex flex-col items-center w-full self-center text-light-100">
			<Header />
		</div>
		<div class="flex flex-col items-center h-auto min-h-[700px] w-full text-light-100 justify-center self-center">
			<div class="flex w-full mt-16 mobile:mt-6 items-center max-w-4xl mobile:flex-col-reverse">
				<div class="flex flex-1 justify-center flex-col mobile:mt-8 mobile:p-6">
					<UploaderLink />
				</div>
				<div>
					<h5 class="font-bold text-7xl px-7">OR</h5>
				</div>

				<Uploader />
			</div>

			<TransitionRoot
				appear
				:show="files.length > 0"
				as="template"
				enter="transform transition duration-200"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="transform duration-200 transition ease-in-out"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div
					class="flex w-full mt-16 flex-col rounded-md bg-[#181a1b] border-4 shadow-lg border-[#303436] items-center justify-center p-4 py-8 max-w-4xl"
				>
					<div
						v-for="file in files"
						:key="file.uuid"
						class="w-[calc(100%-2rem)] h-8 rounded-sm pl-2 py-1 relative last:mb-0"
						:class="[{ 'mb-2': files.length > 1 }]"
					>
						<div class="w-full h-full absolute top-0 left-0 pointer-events-none bg-dark-100" />
						<div
							class="w-full h-full absolute top-0 left-0 pointer-events-none transition-all linear duration-200"
							:class="{
								'bg-green-800': file.status === 'success',
								'bg-yellow-900': file.status === 'uploading',
								'bg-red-900': file.status === 'error'
							}"
							:style="[{ width: file.status === 'error' ? '100%' : `${file.progress}%` }]"
						/>
						<div class="absolute top-0 left-0 flex items-center w-full h-full">
							<div>
								<span class="text-[10px] pl-2">
									{{ formatBytes(file.bytesTotal) }}
								</span>
								<span class="text-xs">
									- {{ file.name }} {{ file.error ? ` - ${file.error}` : '' }}</span
								>
							</div>

							<div class="flex-1" />
							<div v-if="file.url" class="text-sm pr-2 flex items-center">
								<a
									:href="file.url"
									class="link cursor-pointer"
									rel="noopener noreferrer"
									target="_blank"
									>Link</a
								>
							</div>
						</div>
					</div>
				</div>
			</TransitionRoot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { TransitionRoot } from '@headlessui/vue';
import { useWindowSize } from '@vueuse/core';
import { ref, computed, onMounted } from 'vue';
import Header from '~/components/header/Header.vue';
import Uploader from '~/components/upload/Uploader.vue';
import UploaderLink from '~/components/upload/UploaderLink.vue';
import { useUploadsStore } from '~/store';
import { formatBytes } from '~/use/file';

const uploadsStore = useUploadsStore();
const files = computed(() => uploadsStore.files);
const isMobile = ref(false);

onMounted(() => {
	isMobile.value = useWindowSize().width.value < 640;
});
</script>
