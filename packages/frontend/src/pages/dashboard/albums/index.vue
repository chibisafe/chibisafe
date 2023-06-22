<template>
	<Sidebar>
		<div class="mx-auto max-w-7xl px-4 desktop:px-6 mobile:px-8">
			<Breadcrumbs
				:pages="[
					{
						name: 'Albums',
						href: '/dashboard/albums'
					}
				]"
			/>
			<h1 class="text-2xl mt-8 font-semibold text-light-100 flex items-center">
				You have {{ albums.length }} album{{ albums.length > 1 ? 's' : '' }}
				<Button class="ml-4 mt-3" @click="showNewAlbumModal">Add new</Button>
			</h1>
			<div class="mt-8 pb-16">
				<ul
					role="list"
					class="mt-3 grid grid-cols-1 gap-5 desktop:grid-cols-3 desktop:gap-6 mobile:grid-cols-1"
				>
					<li
						v-for="album in albums"
						:key="album.uuid"
						class="col-span-1 flex rounded-md shadow-sm hover:shadow-lg cursor-pointer h-16 w-72"
					>
						<router-link :to="`/dashboard/albums/${album.uuid}`" class="flex w-full">
							<div
								class="flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md border-t border-l border-b bg-dark-90 dark:border-dark-90"
								:style="album.cover ? `background: url(${album.cover})` : ''"
							/>
							<div
								class="flex flex-1 items-center justify-between truncate border-t border-r border-b border-gray-200 bg-white dark:bg-dark-110 dark:border-dark-90"
							>
								<div class="flex-1 truncate px-4 py-2 text-sm">
									<p class="font-medium text-gray-900 hover:text-gray-600 dark:text-light-100">
										{{ album.name }}
									</p>
									<p v-if="album.count" class="text-gray-400">
										{{ album.count }} file{{ album.count > 1 ? 's' : '' }}
									</p>
								</div>
							</div>
						</router-link>
						<div
							class="flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-r-md border-t border-r border-b bg-dark-110 dark:border-dark-90"
							@click="showEditAlbumModal(album)"
						>
							<IconSettings />
						</div>
					</li>
				</ul>
			</div>
		</div>
	</Sidebar>
	<NewAlbumModal />
	<AlbumSettingsModal />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAlbumsStore, useModalStore } from '~/store';
import type { Album } from '~/types';

import Sidebar from '~/components/sidebar/Sidebar.vue';
import Button from '~/components/buttons/Button.vue';
import IconSettings from '~icons/carbon/settings';

import NewAlbumModal from '~/components/modals/NewAlbumModal.vue';
import AlbumSettingsModal from '~/components/modals/AlbumSettingsModal.vue';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';

const albumsStore = useAlbumsStore();
const modalsStore = useModalStore();
const albums = computed(() => albumsStore.albums);

const showNewAlbumModal = () => {
	modalsStore.newAlbum.show = true;
};

const showEditAlbumModal = (album: Album) => {
	void albumsStore.getAlbumLinks(album.uuid);
	modalsStore.albumSettings.album = album;
	modalsStore.albumSettings.show = true;
};

void albumsStore.get();
albumsStore.album = null;
</script>
