<template>
	<Listbox v-model="selectedAlbum">
		<div>
			<ListboxButton
				class="relative w-full cursor-default rounded-lg bg-dark-85 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
			>
				<span v-if="selectedAlbum" class="block truncate">{{ selectedAlbum.name }}</span>
				<span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
					<ChevronsUpDownIcon class="h-5 w-5 text-light-100" aria-hidden="true" />
				</span>
			</ListboxButton>

			<transition
				leave-active-class="transition duration-100 ease-in"
				leave-from-class="opacity-100"
				leave-to-class="opacity-0"
			>
				<ListboxOptions
					class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-dark-85 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50"
				>
					<ListboxOption
						v-for="album in albums"
						v-slot="{ active, selected }"
						:key="album.name"
						:value="album"
						as="template"
					>
						<li
							class="relative cursor-default select-none py-2 pl-10 pr-4"
							:class="[active ? 'bg-blue-500 text-light-100' : 'text-light-100']"
						>
							<span class="block truncate" :class="[selected ? 'font-medium' : 'font-normal']">{{
								album.name
							}}</span>
							<span
								v-if="selected"
								class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
							>
								<CheckIcon class="h-5 w-5" aria-hidden="true" />
							</span>
						</li>
					</ListboxOption>
				</ListboxOptions>
			</transition>
		</div>
	</Listbox>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { useAlbumsStore } from '~/store';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-vue-next';
import type { Album } from '~/types';

const albumsStore = useAlbumsStore();

// Add "No album" option
const albums = computed(() => {
	return [
		{
			uuid: null,
			name: 'No album'
		} as unknown as Album,
		...albumsStore.albums
	];
});

// Select first album by default
const selectedAlbum = ref(albums.value[0]);
watch(selectedAlbum, () => {
	albumsStore.selectedAlbumForUpload = selectedAlbum.value.uuid;
});

// Force refresh the albums list
onMounted(() => void albumsStore.get(true));
</script>
