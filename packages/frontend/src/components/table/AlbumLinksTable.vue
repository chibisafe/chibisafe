<template>
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead class="text-center w-[100px]"> Views </TableHead>
				<TableHead class="text-center">Link</TableHead>
				<TableHead>Enabled</TableHead>
				<TableHead class="text-right" />
			</TableRow>
		</TableHeader>
		<TableBody>
			<TableRow v-for="item in data" :key="item.uuid">
				<TableCell class="font-medium text-center">
					{{ item.views }}
				</TableCell>
				<TableCell>
					<Button
						as="a"
						variant="link"
						:href="`/a/${item.identifier}`"
						target="_blank"
						rel="noopener noreferrer"
						class="w-full text-light-100 hover:text-blue-400"
					>
						{{ item.identifier }}
					</Button>
				</TableCell>
				<TableCell>
					<Switch :checked="item.enabled" @click="setEnabled(item)" />
				</TableCell>
				<TableCell class="text-right">
					<ConfirmationDialog
						title="Delete album link"
						message="This action will delete the public link associated to this album and prevent people from accessing it. Are you sure?"
						:callback="() => deleteLink(item.uuid)"
					>
						<Button variant="destructive">Delete</Button>
					</ConfirmationDialog>
				</TableCell>
			</TableRow>
		</TableBody>
	</Table>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner';
import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog.vue';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAlbumsStore } from '~/store';
import type { AlbumLink } from '~/types';
import { deleteAlbumLink, updateAlbumLink } from '~/use/api';

const props = defineProps<{
	albumUuid: string;
	data: AlbumLink[];
}>();

const albumsStore = useAlbumsStore();

const setEnabled = async (link: AlbumLink) => {
	await updateAlbumLink(props.albumUuid, link.uuid, {
		name: 'enabled',
		value: !link.enabled
	});

	albumsStore.currentAlbumLinks = albumsStore.currentAlbumLinks.map(l => {
		if (l.uuid === link.uuid) {
			l.enabled = !l.enabled;
		}

		return l;
	});

	toast.success(`Link ${link.enabled ? 'enabled' : 'disabled'}`);
};

const deleteLink = async (uuid: string) => {
	await deleteAlbumLink(props.albumUuid, uuid);
	albumsStore.currentAlbumLinks = albumsStore.currentAlbumLinks.filter(l => l.uuid !== uuid);
	toast.success('Link deleted');
};
</script>
