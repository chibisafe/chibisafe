<template>
	<Dialog @update:open="onOpen">
		<DialogTrigger as-child><slot /></DialogTrigger>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Album settings</DialogTitle>
			</DialogHeader>

			<div class="flex items-center space-x-2 mt-4">
				<Switch id="nsfw" :checked="isNsfw" @click="setNsfw" />
				<Label for="nsfw">NSFW album</Label>
			</div>
			<div class="flex w-full max-w-sm items-end space-x-2">
				<InputWithLabel v-model="albumName" label="Album name" name="name" />
				<Button type="button" @click="setNewAlbumName">Rename</Button>
			</div>

			<DialogHeader class="mt-4">
				<DialogTitle>Album description</DialogTitle>
				<DialogDescription>
					{{ album.description || 'No description set' }}
				</DialogDescription>
				<InputDialog message="Add an album description" title="Description" :callback="setDescription">
					<Button class="shrink-0">Set description</Button>
				</InputDialog>
			</DialogHeader>

			<DialogHeader class="mt-4">
				<DialogTitle>Album links</DialogTitle>
				<DialogDescription>
					A list of all the links created for this album. Each link is unique and will remain private unless
					you share it with the world.
				</DialogDescription>
				<Button type="button" @click="createLink">Create new link</Button>
			</DialogHeader>

			<div v-if="isLoadingLinks" class="space-y-2 mt-2">
				<Skeleton class="h-4 w-[250px]" />
				<Skeleton class="h-4 w-[200px]" />
			</div>
			<AlbumLinksTable v-else :albumUuid="album.uuid" :data="links" />

			<DialogFooter>
				<ConfirmationDialog
					title="Delete album"
					message="This action will delete the album and every public link associated with it. All uploaded files will remain intact. Are you sure?"
					:callback="() => doDeleteAlbum()"
				>
					<Button>Delete album</Button>
				</ConfirmationDialog>
				<ConfirmationDialog
					title="Delete album"
					message="This action will delete the album and ALL files associated with it, even if they are part of other albums so this action is not reversible. Are you sure?"
					:callback="() => doPurgeAlbum()"
				>
					<Button>Delete album and all files</Button>
				</ConfirmationDialog>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { toast } from 'vue-sonner';
import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog.vue';
import InputDialog from '@/components/dialogs/InputDialog.vue';
import InputWithLabel from '@/components/input/InputWithLabel.vue';
import AlbumLinksTable from '@/components/table/AlbumLinksTable.vue';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Album } from '@/types';
import { useAlbumsStore } from '~/store';
import { createAlbumLink, updateAlbum, deleteAlbum, purgeAlbum } from '~/use/api';

const props = defineProps<{
	album: Album;
}>();

const albumsStore = useAlbumsStore();
const links = computed(() => albumsStore.currentAlbumLinks);
const isLoadingLinks = ref(false);

// eslint-disable-next-line vue/no-setup-props-destructure
const albumName = ref(props.album.name);
// eslint-disable-next-line vue/no-setup-props-destructure
const isNsfw = ref(props.album.nsfw);

const onOpen = async (isOpen: boolean) => {
	if (!isOpen) return;
	isLoadingLinks.value = true;
	albumName.value = props.album.name;
	isNsfw.value = props.album.nsfw;
	await albumsStore.getAlbumLinks(props.album.uuid);
	isLoadingLinks.value = false;
};

const setNsfw = async () => {
	isNsfw.value = !isNsfw.value;
	await updateAlbum(props.album.uuid, {
		name: 'nsfw',
		value: isNsfw.value
	});
};

const createLink = async () => {
	const newLink = await createAlbumLink(props.album.uuid);
	albumsStore.currentAlbumLinks.push(newLink.data);
	toast.success('New link created');
};

const setDescription = async (description: string) => {
	await updateAlbum(props.album.uuid, {
		name: 'description',
		value: description
	});
	toast.success('Changed album description');
};

const setNewAlbumName = async () => {
	if (!albumName.value) {
		toast.error('Album name cannot be empty');
		return;
	}

	await updateAlbum(props.album.uuid, {
		name: 'name',
		value: albumName.value
	});
	toast.success('Changed album name');
};

const doDeleteAlbum = async () => {
	await deleteAlbum(props.album.uuid);
	albumsStore.albums = albumsStore.albums.filter(a => a.uuid !== props.album.uuid);
	toast.success('Album deleted');
};

const doPurgeAlbum = async () => {
	await purgeAlbum(props.album.uuid);
	albumsStore.albums = albumsStore.albums.filter(a => a.uuid !== props.album.uuid);
	toast.success('Album purged');
};
</script>
