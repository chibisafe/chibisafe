<template>
	<div class="h-screen w-full overflow-auto">
		<div class="flex flex-col items-center w-full self-center dark:text-light-100">
			<Header />
		</div>
		<div
			class="flex flex-col items-center h-auto min-h-[900px] w-full dark:text-light-100 justify-center self-center"
		>
			<div class="flex w-full mt-16 items-center relative max-w-4xl">
				<div class="flex flex-1 justify-center flex-col">
					<h4 class="font-bold text-7xl">Seriously fast <br />file uploader</h4>
					<p class="mt-10 text-lg pr-16">
						<strong>chibisafe</strong> is a modern and self-hosted take on file uploading services that can
						handle anything you throw at it thanks to it's robust and fast API, chunked uploads support and
						more.
					</p>
					<p class="mt-4 text-lg pr-16">
						It's easily customizable and deploying your own instance is a breeze.
					</p>
				</div>

				<!-- Dummy to keep the flexbox layout -->
				<div class="w-80 h-80 max-w-[320px]" />

				<UppyUploader />
			</div>

			<TransitionRoot
				appear
				:show="files.length > 0"
				as="template"
				enter="transform transition duration-[400ms]"
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
						:class="[
							{
								'mb-2': files.length > 1
							}
						]"
					>
						<div class="w-full h-full absolute top-0 left-0 pointer-events-none bg-dark-100" />
						<div
							class="w-full h-full absolute top-0 left-0 pointer-events-none transition-all linear duration-200"
							:class="{
								'bg-green-800': file.status === 'success',
								'bg-yellow-900': file.status === 'uploading',
								'bg-red-900': file.status === 'error'
							}"
							:style="[
								{
									width: file.status === 'error' ? '100%' : `${file.progress}%`
								}
							]"
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

			<div class="flex w-full mt-32 flex-col max-w-4xl mb-32">
				<h3 class="font-bold text-4xl">Some of chibisafe's features</h3>
				<h5 class="text-blue-400">Did we mention that extending it is super easy?</h5>

				<dl
					class="mt-8 space-y-10 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4 sm:space-y-0 lg:grid-cols-4 lg:gap-x-8"
				>
					<div v-for="feature in features" :key="feature" class="relative">
						<dt>
							<IconCheck class="absolute h-6 w-6 text-green-500" aria-hidden="true" />
							<p class="ml-9 text-lg font-medium leading-6 text-gray-900 dark:text-light-100">
								{{ feature }}
							</p>
						</dt>
					</div>
				</dl>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { TransitionRoot } from '@headlessui/vue';
import { useUploadsStore } from '~/store/uploads';
import { formatBytes } from '~/use/file';

import Header from '~/components/header/Header.vue';
import UppyUploader from '~/components/upload/UppyUploader.vue';

// @ts-ignore
import IconCheck from '~icons/carbon/checkmark';

const uploadsStore = useUploadsStore();
const files = computed(() => uploadsStore.files);

const features = ref([
	'Chunked uploads',
	'Sharing links',
	'Albums/Folders',
	'File management',
	'File tagging',
	'User management',
	'Easy to deploy',
	'Open source',
	'API support',
	'Docker support',
	'ShareX Support',
	'Super Fast',
	'Extensible',
	'No ads',
	'No tracking'
]);
</script>
