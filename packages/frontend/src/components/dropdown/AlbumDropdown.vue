<template>
	<Select v-if="albums" v-model="selectedAlbum">
		<SelectTrigger>
			<SelectValue placeholder="Select an album" />
		</SelectTrigger>
		<SelectContent>
			<ScrollArea>
				<SelectGroup class="max-h-[480px]">
					<SelectItem v-for="album in albums" :key="album.name" :value="album.name">
						{{ album.name }}
					</SelectItem>
				</SelectGroup>
			</ScrollArea>
		</SelectContent>
	</Select>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAlbumsStore } from '~/store';

const albumsStore = useAlbumsStore();

// Add "No album" option
const albums = computed(() => [
	{
		uuid: null,
		name: 'No album'
	},
	...albumsStore.albums
]);

// Select first album by default
const selectedAlbum = ref('');
watch(selectedAlbum, () => {
	albumsStore.selectedAlbumForUpload = albums.value.find(album => album.name === selectedAlbum.value)?.uuid ?? null;
});

// Force refresh the albums list
onMounted(() => void albumsStore.get(true));
</script>
