<template>
	<Table class="bg-dark-110">
		<TableHeader>
			<TableRow>
				<TableHead>Thumbnail</TableHead>
				<TableHead>Link</TableHead>
				<TableHead>Original</TableHead>
				<TableHead>Size</TableHead>
				<TableHead v-if="type === 'admin' || type === 'quarantine'">Uploader</TableHead>
				<TableHead>Created on</TableHead>
				<TableHead class="text-right" />
			</TableRow>
		</TableHeader>
		<TableBody>
			<TableRow v-for="file in files" :key="file.uuid">
				<TableCell>
					<FileInformationDialog
						v-if="
							(type !== 'publicAlbum' && !file.quarantine) ||
							((type === 'admin' || type === 'quarantine') && file.quarantine)
						"
						:file="file"
						:type="type"
					>
						<template v-if="(isFileImage(file) || isFileVideo(file)) && !file.quarantine">
							<img :src="file.thumb" class="h-16" />
						</template>
						<FileWarningIcon v-else-if="file.quarantine" class="text-red-500 w-16 h-16" />
						<FileAudioIcon v-else-if="isFileAudio(file)" class="text-light-100 w-16 h-16" />
						<FileTextIcon v-else-if="isFilePDF(file)" class="text-light-100 w-16 h-16" />
						<FileIcon v-else class="text-light-100 w-16 h-16" />
					</FileInformationDialog>
					<FileWarningIcon
						v-if="file.quarantine && type !== 'admin' && type !== 'quarantine'"
						class="text-red-500 w-16 h-16"
					/>
				</TableCell>
				<TableCell>
					<a :href="file.url" target="_blank" rel="noopener noreferrer" class="hover:text-blue-400">{{
						file.name
					}}</a>
				</TableCell>
				<TableCell>
					<a
						:href="file.url"
						:download="file.original"
						target="_blank"
						rel="noopener noreferrer"
						class="hover:text-blue-400"
						>{{ file.original }}</a
					>
				</TableCell>
				<TableCell>
					{{ formatBytes(Number(file.size)) }}
				</TableCell>
				<TableCell v-if="type === 'admin' || type === 'quarantine'">{{ file.user?.username }}</TableCell>
				<TableCell>
					{{ dayjs(file.createdAt).format('MMMM D, YYYY h:mm A') }}
				</TableCell>
				<TableCell class="flex justify-end">
					<ConfirmationDialog
						title="Delete file"
						message="The file will be deleted and gone forever with no way to recover it. It will also remove it from any albums that you added it to. Are you sure?"
						proceedText="Delete"
						:callback="() => doDeleteFile(file)"
						><Button variant="destructive">Delete</Button></ConfirmationDialog
					>
				</TableCell>
			</TableRow>
		</TableBody>
	</Table>
</template>

<script setup lang="ts">
import { useQueryClient, useMutation } from '@tanstack/vue-query';
import dayjs from 'dayjs';
import { FileIcon, FileTextIcon, FileAudioIcon, FileWarningIcon } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ConfirmationDialog from '~/components/dialogs/ConfirmationDialog.vue';
import FileInformationDialog from '~/components/dialogs/FileInformationDialog.vue';
import type { FileWithAdditionalData, FilePropsType } from '~/types';
import { deleteFileAsAdmin, deleteFile } from '~/use/api';
import { isFileVideo, isFileImage, isFileAudio, isFilePDF, formatBytes } from '~/use/file';

const props = defineProps<{
	files: FileWithAdditionalData[];
	type: FilePropsType;
}>();

const isAdmin = props.type === 'admin' || props.type === 'quarantine';
const queryClient = useQueryClient();

const { mutate: mutateDeleteFile } = useMutation({
	mutationFn: (uuid: string) => (isAdmin ? deleteFileAsAdmin(uuid) : deleteFile(uuid))
});

const doDeleteFile = (file: FileWithAdditionalData) => {
	if (!file) return;

	mutateDeleteFile(file.uuid, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: isAdmin ? ['admin', 'files'] : ['files'] });
			toast.success('File deleted');
		}
	});
};
</script>
