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
							class="inline-block max-h-[calc(100vh-8rem)] w-full max-w-5xl p-4 overflow-hidden text-left align-middle transition-all transform bg-dark-110 shadow-xl rounded-md overflow-y-auto"
						>
							<!--  -->

							<div class="px-4 desktop:px-6 lg:px-8 mt-6 mb-8">
								<div class="desktop:flex desktop:items-center">
									<div v-if="album" class="desktop:flex-auto">
										<h1 class="text-xl font-semibold text-light-100">Album settings</h1>
										<SwitchGroup>
											<div class="flex items-center mt-8">
												<SwitchLabel class="mr-4 text-light-100">Mark as NSFW</SwitchLabel>
												<Switch
													v-model="album.nsfw"
													class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 border-gray-600"
													:class="[album.nsfw ? 'bg-blue-400' : 'bg-gray-200']"
													@update:modelValue="setNsfw"
												>
													<span class="sr-only">Mark as NSFW</span>
													<span
														aria-hidden="true"
														class="pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out bg-dark-90"
														:class="[album.nsfw ? 'translate-x-5' : 'translate-x-0']"
													/>
												</Switch>
											</div>
										</SwitchGroup>

										<div class="mt-4 max-w-xs">
											<div class="flex rounded-md shadow-sm">
												<div class="relative flex flex-grow items-stretch focus-within:z-10">
													<div
														class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
													></div>
													<!-- eslint-disable-next-line vue/component-name-in-template-casing -->
													<input
														v-model="album.name"
														type="text"
														class="block w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 desktop:text-sm"
														@keyup.enter="setNewAlbumName"
													/>
												</div>
												<!-- eslint-disable-next-line vue/component-name-in-template-casing -->
												<button
													type="button"
													class="relative -ml-px inline-flex items-center space-x-2 rounded-r-md bg-gray-50 px-4 py-2 text-sm font-medium bg-dark-100 hover:bg-dark-90 text-light-100 focus:border-indigo-500 focus:ring-indigo-500 w-36 border focus:ring-0 focus:outline-none focus:ring-gray-100 border-gray-700"
													@click="setNewAlbumName"
												>
													<span class="w-full text-center">Change name</span>
												</button>
											</div>
										</div>
									</div>
								</div>

								<div class="relative mt-8 mb-4 h-[1px]">
									<div class="absolute inset-0 flex items-center" aria-hidden="true">
										<div class="w-full border-t border-gray-500" />
									</div>
								</div>

								<div class="desktop:flex desktop:items-center mt-8">
									<div class="desktop:flex-auto">
										<h1 class="text-xl font-semibold text-light-100">Album links</h1>
										<p class="mt-2 text-sm text-light-100">
											A list of all the links created for this album. Each link is unique and will
											remain private unless you share it with the world.
										</p>
									</div>
									<div class="mt-4 desktop:mt-0 desktop:ml-16 desktop:flex-none">
										<Button
											type="button"
											class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 desktop:w-auto"
											@click="createLink"
											>Create new link</Button
										>
									</div>
								</div>
								<div
									class="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 desktop:-mx-6 md:mx-0 md:rounded-lg"
								>
									<table class="min-w-full divide-y divide-gray-600">
										<thead class="bg-dark-100">
											<tr>
												<th
													scope="col"
													class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-light-100 desktop:pl-6"
												>
													Link
												</th>
												<th
													scope="col"
													class="hidden px-3 py-3.5 text-left text-sm font-semibold text-light-100 lg:table-cell"
												>
													Views
												</th>
												<!--
												  <th
												  scope="col"
												  class="hidden px-3 py-3.5 text-left text-sm font-semibold text-light-100 desktop:table-cell"
												  >
												  Allow download
												  </th> 
												-->
												<th
													scope="col"
													class="px-3 py-3.5 text-left text-sm font-semibold text-light-100"
												>
													Enabled
												</th>
												<th
													scope="col"
													class="px-3 py-3.5 text-left text-sm font-semibold text-light-100"
												>
													Expiry date
												</th>
												<th scope="col" class="relative py-3.5 pl-3 pr-4 desktop:pr-6">
													<span class="sr-only">Delete</span>
												</th>
											</tr>
										</thead>
										<tbody class="divide-y bg-dark-110 divide-gray-600">
											<tr v-for="link in links" :key="link.uuid">
												<td
													class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-light-100 desktop:w-auto desktop:max-w-none desktop:pl-6"
												>
													<a
														:href="`/a/${link.identifier}`"
														target="_blank"
														rel="noopener noreferrer"
														class="text-blue-400"
														>{{ link.identifier }}</a
													>
													<dl class="font-normal lg:hidden">
														<dt class="sr-only">Views</dt>
														<dd class="mt-1 truncate text-light-100">
															{{ link.views }}
														</dd>
														<dt class="sr-only desktop:hidden">Allow download</dt>
														<dd class="mt-1 truncate text-light-100 desktop:hidden">
															<Switch
																v-model="link.enableDownload"
																class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 border-gray-600"
																:class="[
																	link.enableDownload ? 'bg-blue-400' : 'bg-gray-200'
																]"
																@update:modelValue="setEnableDownload(link)"
															>
																<span class="sr-only">Use setting</span>
																<span
																	aria-hidden="true"
																	class="pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out bg-dark-90"
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
												<td class="hidden px-3 py-4 text-sm text-light-100 lg:table-cell">
													{{ link.views }}
												</td>
												<!--
												  <td
												  class="hidden px-3 py-4 text-sm text-light-100 desktop:table-cell"
												  >
												  <Switch
												  v-model="link.enableDownload"
												  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 border-gray-600"
												  :class="[link.enableDownload ? 'bg-blue-400' : 'bg-gray-200']"
												  @update:modelValue="setEnableDownload(link)"
												  >
												  <span class="sr-only">Use setting</span>
												  <span
												  aria-hidden="true"
												  class="pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out bg-dark-90"
												  :class="[
												  link.enableDownload ? 'translate-x-5' : 'translate-x-0'
												  ]"
												  />
												  </Switch>
												  </td> 
												-->
												<td class="px-3 py-4 text-sm text-light-100">
													<Switch
														v-model="link.enabled"
														class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 border-gray-600"
														:class="[link.enabled ? 'bg-blue-400' : 'bg-gray-200']"
														@update:modelValue="setEnabled(link)"
													>
														<span class="sr-only">Use setting</span>
														<span
															aria-hidden="true"
															class="pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out bg-dark-90"
															:class="[link.enabled ? 'translate-x-5' : 'translate-x-0']"
														/>
													</Switch>
												</td>
												<td class="py-4 pl-3 pr-4 text-left text-sm font-medium desktop:pr-6">
													<Button
														type="button"
														class="inline-flex items-center justify-center rounded-md border border-transparent !bg-dark-100 hover:!bg-dark-90 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 desktop:w-auto"
														>Set</Button
													>
												</td>
												<td class="py-4 pl-3 pr-4 text-right text-sm font-medium desktop:pr-6">
													<!-- eslint-disable-next-line vue/component-name-in-template-casing -->
													<button
														href="#"
														type="button"
														class="text-blue-400 hover:text-indigo-900"
														@click="showManageAlbumModal('deletelink', link)"
													>
														Delete<span class="sr-only">, {{ link.identifier }}</span>
													</button>
												</td>
											</tr>
										</tbody>
									</table>
								</div>

								<div class="relative my-8">
									<div class="absolute inset-0 flex items-center" aria-hidden="true">
										<div class="w-full border-t border-gray-500" />
									</div>
									<div class="relative flex justify-center">
										<span class="bg-dark-90 px-2 text-sm text-red-400">Danger zone</span>
									</div>
								</div>

								<div class="desktop:mt-0 desktop:flex-none">
									<Button
										type="button"
										class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 desktop:w-auto"
										@click="showManageAlbumModal('delete')"
										>Delete album</Button
									>

									<Button
										type="button"
										class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 desktop:w-auto"
										@click="showManageAlbumModal('purge')"
										>Delete album and all files</Button
									>
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
	<ManageAlbumModal />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
	TransitionRoot,
	TransitionChild,
	Dialog,
	DialogOverlay,
	Switch,
	SwitchGroup,
	SwitchLabel
} from '@headlessui/vue';
import { useModalStore, useAlbumsStore } from '~/store';
import { createAlbumLink, updateAlbum, updateAlbumLink } from '~/use/api';
import { toast } from 'vue-sonner';
import Button from '~/components/buttons/Button.vue';
import ManageAlbumModal from '~/components/modals/ManageAlbumModal.vue';
import type { AlbumLink } from '~/types';

const modalsStore = useModalStore();
const albumsStore = useAlbumsStore();

const isModalOpen = computed(() => modalsStore.albumSettings.show);

const links = computed(() => albumsStore.currentAlbumLinks);
const album = computed(() => modalsStore.albumSettings.album);

const createLink = async () => {
	if (!modalsStore.albumSettings.album) return;
	const newLink = await createAlbumLink(modalsStore.albumSettings.album.uuid);
	albumsStore.currentAlbumLinks.push(newLink.data);
	toast.success('Link created');
};

const setEnabled = async (link: AlbumLink) => {
	if (!modalsStore.albumSettings.album) return;
	await updateAlbumLink(modalsStore.albumSettings.album.uuid, link.uuid, {
		name: 'enabled',
		value: link.enabled
	});
};

const setEnableDownload = async (link: AlbumLink) => {
	if (!modalsStore.albumSettings.album) return;
	await updateAlbumLink(modalsStore.albumSettings.album.uuid, link.uuid, {
		name: 'enableDownload',
		value: link.enableDownload
	});
};

const setExpiryDate = async (link: AlbumLink) => {
	// if (!modalsStore.albumSettings.album) return;
	// await updateAlbumLink(modalsStore.albumSettings.album.uuid, link.uuid, {
	// 	name: 'enableDownload',
	// 	value: link.enabled
	// });
};

const setNsfw = async () => {
	if (!modalsStore.albumSettings.album) return;
	await updateAlbum(modalsStore.albumSettings.album.uuid, {
		name: 'nsfw',
		value: album.value?.nsfw
	});
};

const setNewAlbumName = async () => {
	if (!album.value?.name) return;
	if (!modalsStore.albumSettings.album) return;
	await updateAlbum(modalsStore.albumSettings.album.uuid, {
		name: 'name',
		value: album.value.name
	});
	toast.success('Changed album name');
};

const afterDeleteLink = async (link: AlbumLink | undefined) => {
	if (!modalsStore.albumSettings.album) return;
	if (!link) return;
	albumsStore.currentAlbumLinks = albumsStore.currentAlbumLinks.filter(l => l.uuid !== link.uuid);
};

const afterDeleteAlbum = async () => {
	if (!modalsStore.albumSettings.album) return;
	albumsStore.albums = albumsStore.albums.filter(a => a.uuid !== modalsStore.albumSettings.album?.uuid);
	closeModal();
};

const showManageAlbumModal = (action: string, link?: AlbumLink) => {
	if (!modalsStore.albumSettings.album) return;
	if (action === 'deletelink' && !link) return;

	modalsStore.manageAlbum.album = modalsStore.albumSettings.album;
	modalsStore.manageAlbum.action = action;
	modalsStore.manageAlbum.link = link;
	modalsStore.manageAlbum.show = true;

	modalsStore.manageAlbum.callback =
		action === 'deletelink' ? async () => afterDeleteLink(link) : async () => afterDeleteAlbum();
};

// Clear the store only after the transition is done to prevent artifacting
const clearStore = () => {
	modalsStore.albumSettings.album = null;
};

const closeModal = () => {
	modalsStore.albumSettings.show = false;
};
</script>
