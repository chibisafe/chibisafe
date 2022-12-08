<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
	<TransitionRoot appear :show="isModalOpen" as="template" @afterLeave="clearStore">
		<Dialog as="div" @close="closeModal">
			<DialogOverlay class="fixed inset-0 bg-black opacity-50" />
			<div class="fixed inset-0 z-10 overflow-y-auto">
				<div class="min-h-screen px-4 text-center">
					<TransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0"
						enter-to="opacity-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100"
						leave-to="opacity-0"
					>
						<DialogOverlay class="fixed inset-0" />
					</TransitionChild>

					<span class="inline-block h-screen align-middle" aria-hidden="true"> &#8203; </span>

					<TransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95"
					>
						<div
							class="inline-block max-h-[calc(100vh-8rem)] w-full max-w-5xl p-4 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-dark-90 shadow-xl rounded-md overflow-y-auto"
						>
							<!--  -->

							<div class="px-4 sm:px-6 lg:px-8 mt-6 mb-8">
								<div class="sm:flex sm:items-center">
									<div class="sm:flex-auto">
										<h1 class="text-xl font-semibold text-gray-900 dark:text-light-100">
											Album links
										</h1>
										<p class="mt-2 text-sm text-gray-700 dark:text-light-100">
											A list of all the links created for this album. Each link is unique and will
											remain private unless you share it with the world. You can also specify if
											you'd like to enable zip downloads for the specified link.
										</p>
									</div>
									<div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
										<Button
											type="button"
											class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
											>Create new link</Button
										>
									</div>
								</div>
								<div
									class="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg"
								>
									<table class="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
										<thead class="bg-gray-100 dark:bg-dark-100">
											<tr>
												<th
													scope="col"
													class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-light-100 sm:pl-6"
												>
													Link
												</th>
												<th
													scope="col"
													class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-light-100 lg:table-cell"
												>
													Views
												</th>
												<th
													scope="col"
													class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-light-100 sm:table-cell"
												>
													Allow download
												</th>
												<th
													scope="col"
													class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-light-100"
												>
													Enabled
												</th>
												<th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
													<span class="sr-only">Delete</span>
												</th>
											</tr>
										</thead>
										<tbody
											class="divide-y divide-gray-200 bg-white dark:bg-dark-110 dark:divide-gray-600"
										>
											<tr v-for="link in links" :key="link.uuid">
												<td
													class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-light-100 sm:w-auto sm:max-w-none sm:pl-6"
												>
													{{ link.identifier }}
													<dl class="font-normal lg:hidden">
														<dt class="sr-only">Views</dt>
														<dd class="mt-1 truncate text-gray-700 dark:text-light-100">
															{{ link.views }}
														</dd>
														<dt class="sr-only sm:hidden">Allow download</dt>
														<dd
															class="mt-1 truncate text-gray-500 dark:text-light-100 sm:hidden"
														>
															<Switch
																v-model="link.enableDownload"
																class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 dark:border-gray-600"
																:class="[
																	link.enableDownload ? 'bg-blue-400' : 'bg-gray-200'
																]"
															>
																<span class="sr-only">Use setting</span>
																<span
																	aria-hidden="true"
																	class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out dark:bg-dark-90"
																	:class="[
																		link.enableDownload
																			? 'translate-x-5'
																			: 'translate-x-0'
																	]"
																/>
															</Switch>
														</dd>
													</dl>
												</td>
												<td
													class="hidden px-3 py-4 text-sm text-gray-500 dark:text-light-100 lg:table-cell"
												>
													{{ link.views }}
												</td>
												<td
													class="hidden px-3 py-4 text-sm text-gray-500 dark:text-light-100 sm:table-cell"
												>
													<Switch
														v-model="link.enableDownload"
														class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 dark:border-gray-600"
														:class="[link.enableDownload ? 'bg-blue-400' : 'bg-gray-200']"
													>
														<span class="sr-only">Use setting</span>
														<span
															aria-hidden="true"
															class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out dark:bg-dark-90"
															:class="[
																link.enableDownload ? 'translate-x-5' : 'translate-x-0'
															]"
														/>
													</Switch>
												</td>
												<td class="px-3 py-4 text-sm text-gray-500 dark:text-light-100">
													<Switch
														v-model="link.enabled"
														class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 dark:border-gray-600"
														:class="[link.enabled ? 'bg-blue-400' : 'bg-gray-200']"
													>
														<span class="sr-only">Use setting</span>
														<span
															aria-hidden="true"
															class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out dark:bg-dark-90"
															:class="[link.enabled ? 'translate-x-5' : 'translate-x-0']"
														/>
													</Switch>
												</td>
												<td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
													<a href="#" class="text-blue-400 hover:text-indigo-900"
														>Delete<span class="sr-only">, {{ link.identifier }}</span></a
													>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>

							<!--  -->
						</div>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
	<DeleteFileModal />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { TransitionRoot, TransitionChild, Dialog, DialogOverlay, Switch } from '@headlessui/vue';
import { useModalstore } from '~/store/modals';
import { useToastStore } from '~/store/toast';
import { useAlbumsStore } from '~/store/albums';
import Button from '~/components/buttons/Button.vue';

const modalsStore = useModalstore();
const toastStore = useToastStore();
const albumsStore = useAlbumsStore();

const isModalOpen = computed(() => modalsStore.albumSettings.show);

const links = computed(() => albumsStore.currentAlbumLinks);

// Clear the store only after the transition is done to prevent artifacting
const clearStore = () => {
	modalsStore.albumSettings.album = null;
};

const closeModal = () => {
	modalsStore.albumSettings.show = false;
};
</script>
