<template>
	<ScrollArea class="w-full">
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
				<div class="ml-4 mt-3">
					<InputDialog
						title="Create new album"
						label="Album name"
						proceedText="Create"
						:callback="createNewAlbum"
					>
						New album
					</InputDialog>
				</div>
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
								class="flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md border-t border-l border-b bg-dark-90 border-dark-90"
								:style="album.cover ? `background: url(${album.cover})` : ''"
							/>
							<div
								class="flex flex-1 items-center justify-between truncate border-t border-r border-b bg-dark-110 border-dark-90"
							>
								<div class="flex-1 truncate px-4 py-2 text-sm">
									<p class="font-medium hover:text-white text-light-100">
										{{ album.name }}
									</p>
									<p v-if="album.count" class="text-gray-400">
										{{ album.count }} file{{ album.count > 1 ? 's' : '' }}
									</p>
								</div>
							</div>
						</router-link>
						<div
							class="flex-shrink-0 w-16 text-white text-sm font-medium rounded-r-md border-t border-r border-b bg-dark-110 border-dark-90"
						>
							<AlbumSettingsDialog :album="album">
								<div class="w-16 h-16 flex items-center justify-center"><Settings2Icon /></div>
							</AlbumSettingsDialog>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</ScrollArea>
	<NewAlbumModal />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAlbumsStore } from '~/store';
import { createAlbum } from '@/use/api';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Settings2Icon } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

import NewAlbumModal from '~/components/modals/NewAlbumModal.vue';
import AlbumSettingsDialog from '@/components/dialogs/AlbumSettingsDialog.vue';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';
import InputDialog from '@/components/dialogs/InputDialog.vue';

const albumsStore = useAlbumsStore();
const albums = computed(() => albumsStore.albums);

const createNewAlbum = async (name: string) => {
	if (!name) return;
	await createAlbum(name);

	// Refresh the album list on the store
	void albumsStore.get(true);

	toast.success('Album created');
};

void albumsStore.get();
albumsStore.album = null;
</script>
