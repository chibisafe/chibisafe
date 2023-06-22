<template>
	<div class="h-screen w-full overflow-auto">
		<div class="flex flex-col items-center w-full self-center dark:text-light-100">
			<Header />
		</div>
		<div
			class="flex flex-col items-center h-auto min-h-[900px] w-full dark:text-light-100 justify-center self-center"
		>
			<div
				class="flex w-full mt-16 mobile:mt-6 items-center relative max-w-4xl mobile:flex-col-reverse mobile:p-6"
			>
				<div
					v-if="!isMobile || (isMobile && !files.length)"
					class="flex flex-1 justify-center flex-col mobile:mt-8"
				>
					<h4 class="font-bold text-7xl mobile:text-center">
						Seriously fast <br v-if="!isMobile" />file uploader
					</h4>
					<p class="mt-10 text-lg pr-16 mobile:pr-0">
						<strong>chibisafe</strong> is a modern and self-hosted take on file uploading services that can
						handle anything you throw at it thanks to it's robust and fast API, chunked uploads support and
						more.
					</p>
					<p class="mt-4 text-lg pr-16 mobile:pr-0">
						It's easily customizable and deploying your own instance is a breeze.
					</p>
				</div>

				<!-- Dummy to keep the flexbox layout -->
				<div class="w-80 h-80 max-w-[320px] mobile:hidden" />

				<ChibiUploader />
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

			<div class="flex w-full mt-32 mobile:mt-20 flex-col max-w-4xl mobile:p-6">
				<h3 class="font-bold text-4xl">Some of chibisafe's features</h3>
				<h5 class="text-blue-400">Did we mention that extending it is super easy?</h5>

				<dl
					class="mt-8 space-y-10 desktop:grid desktop:grid-cols-2 desktop:gap-x-6 desktop:gap-y-4 desktop:space-y-0 mobile:grid-cols-4 mobile:gap-x-8"
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

			<div class="flex w-full mt-32 mobile:mt-20 flex-col max-w-4xl mb-32 mobile:p-6">
				<h3 class="font-bold text-4xl mb-6">Frequently Asked Questions</h3>

				<h4 class="text-2xl mb-2">What is chibisafe?</h4>
				<p class="text-lg mb-8">
					chibisafe is an easy to use, open source and completely free file upload service. We accept your
					files, photos, documents, anything, and give you back a shareable link for you to send to others.
				</p>

				<h4 class="text-2xl mb-2">Can I run my own chibisafe?</h4>
				<p class="text-lg mb-8">
					Definitely. Head to our
					<a
						href="https://github.com/chibisafe/chibisafe"
						rel="noopener noreferrer"
						target="_blank"
						class="text-blue-400"
						>GitHub repo</a
					>
					and follow the instructions to clone, build and deploy it by yourself. It's super easy too!
				</p>

				<h4 class="text-2xl mb-2">How can I keep track of my uploads?</h4>
				<p class="text-lg mb-8">
					You can do that by creating a user on the site and then every upload will be associated with your
					account, granting you access to your uploaded files through our dashboard.
				</p>

				<h4 class="text-2xl mb-2">What are albums?</h4>
				<p class="text-lg mb-8">
					Albums are a simple way of sorting uploads together. Right now you can create albums through the
					dashboard and use them only with our chrome extension which will enable you to right click -> send
					to chibisafe or to a desired album if you have any.
				</p>

				<h4 class="text-2xl mb-2">Why should I use this?</h4>
				<p class="text-lg mb-8">
					There are too many file upload services out there, and a lot of them rely on the foundations of pomf
					which is ancient. In a desperate and unsuccessful attempt of finding a good file uploader that's
					easily extendable, chibisafe was born. We give you control over your files, we give you a way to
					sort your uploads into albums for ease of access and we give you an api to use with ShareX or any
					other thing that let's you make POST requests.
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { TransitionRoot } from '@headlessui/vue';
import { useUploadsStore } from '~/store';
import { formatBytes } from '~/use/file';
import { useWindowSize } from '@vueuse/core';

import Header from '~/components/header/Header.vue';
import ChibiUploader from '~/components/upload/ChibiUploader.vue';

// @ts-ignore
import IconCheck from '~icons/carbon/checkmark';

const uploadsStore = useUploadsStore();
const files = computed(() => uploadsStore.files);
const isMobile = computed(() => useWindowSize().width.value < 640);

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
