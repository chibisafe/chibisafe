<template>
	<TransitionRoot appear :show="isModalOpen" as="template" @afterLeave="clearStore">
		<Dialog as="div" class="relative z-10" @close="closeModal">
			<TransitionChild
				as="template"
				enter="ease-out duration-300"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="ease-in duration-200"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
			</TransitionChild>

			<div class="fixed inset-0 z-10 overflow-y-auto">
				<div class="flex min-h-full items-end justify-center p-4 text-center desktop:items-center desktop:p-0">
					<TransitionChild
						as="template"
						enter="ease-out duration-300"
						enter-from="opacity-0 translate-y-4 desktop:translate-y-0 desktop:scale-95"
						enter-to="opacity-100 translate-y-0 desktop:scale-100"
						leave="ease-in duration-200"
						leave-from="opacity-100 translate-y-0 desktop:scale-100"
						leave-to="opacity-0 translate-y-4 desktop:translate-y-0 desktop:scale-95"
					>
						<DialogPanel
							class="relative transform overflow-hidden rounded-lg bg-dark-110 px-4 pt-5 pb-4 text-left shadow-xl transition-all desktop:my-8 desktop:w-full desktop:max-w-lg desktop:p-6"
						>
							<div class="absolute top-0 right-0 hidden pt-4 pr-4 desktop:block">
								<button
									type="button"
									class="rounded-md bg-dark-110 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-0 focus:ring-indigo-500 focus:ring-offset-2"
									@click="closeModal"
								>
									<span class="sr-only">Close</span>
									<XIcon class="h-6 w-6" aria-hidden="true" />
								</button>
							</div>
							<div class="desktop:flex desktop:items-start">
								<div class="mt-3 text-center desktop:mt-0 desktop:ml-4 desktop:text-left">
									<DialogTitle as="h3" class="text-lg font-medium leading-6 text-light-100">{{
										title
									}}</DialogTitle>
									<div class="mt-4">
										<p class="text-sm text-light-100">
											{{ message }}
										</p>
									</div>
									<div class="flex items-center">
										<div
											class="mt-2 relative rounded-md bg-dark-100 border border-dark-80 px-3 py-2 shadow-sm w-full"
										>
											<input
												v-model="inputValue"
												type="text"
												class="block w-full border-0 p-0 text-light-100 placeholder-gray-500 focus:ring-0 sm:text-sm bg-dark-100"
											/>
										</div>
										<p
											v-if="dataType === 'bytes'"
											class="text-light-100 mt-2 ml-2 whitespace-nowrap"
										>
											{{ formatBytes(Number(inputValue)) }}
										</p>
									</div>
								</div>
							</div>
							<div class="mt-5 desktop:mt-4 desktop:flex desktop:flex-row-reverse">
								<button
									type="button"
									class="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-400 focus:outline-none focus:ring-0 focus:ring-red-500 focus:ring-offset-2 desktop:ml-3 desktop:w-auto desktop:text-sm"
									@click="doAction"
								>
									{{ actionText }}
								</button>
								<button
									type="button"
									class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-0 focus:ring-indigo-500 focus:ring-offset-2 desktop:mt-0 desktop:w-auto desktop:text-sm"
									@click="closeModal"
								>
									Cancel
								</button>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import { useModalStore } from '~/store';
import { XIcon } from 'lucide-vue-next';
import { formatBytes } from '~/use/file';

const props = defineProps<{
	title: string;
	message: string;
	actionText: string;
	dataType: string;
	callback: (value: any) => void;
}>();

const modalsStore = useModalStore();
const isModalOpen = computed(() => modalsStore.genericInput.show);
const inputValue = ref('');

// Clear the store only after the transition is done to prevent artifacting
const clearStore = () => {
	// modalsStore.generic.otherData = null;
};

const closeModal = () => {
	modalsStore.genericInput.show = false;
};

const doAction = () => {
	void props.callback(inputValue.value);
	closeModal();
};
</script>
