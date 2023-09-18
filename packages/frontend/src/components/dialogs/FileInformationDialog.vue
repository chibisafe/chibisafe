<template>
	<Dialog @update:open="onOpen">
		<DialogTrigger
			class="w-full h-full absolute"
			as="a"
			:href="file?.url"
			target="_blank"
			rel="noopener noreferrer"
			variant="none"
			@click.left.stop="event => event.preventDefault()"
		/>
		<DialogContent class="max-w-6xl max-h-[calc(100vh-8rem)]">
			<div v-if="file" class="flex h-full max-h-[calc(100vh-11rem)]">
				<div class="flex flex-1 justify-center items-center">
					<img v-if="isFileImage(file)" :src="file.url" class="max-h-full" />

					<media-controller v-else-if="isFileVideo(file)">
						<!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
						<video slot="media" :src="file.url" crossorigin=""></video>
						<media-control-bar>
							<media-play-button></media-play-button>
							<media-mute-button></media-mute-button>
							<media-volume-range></media-volume-range>
							<media-time-range></media-time-range>
							<media-pip-button></media-pip-button>
							<media-fullscreen-button></media-fullscreen-button>
						</media-control-bar>
					</media-controller>

					<media-controller v-else-if="isFileAudio(file)" audio>
						<!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
						<audio slot="media" :src="file.url"></audio>
						<media-control-bar>
							<media-play-button></media-play-button>
							<media-time-display show-duration></media-time-display>
							<media-time-range></media-time-range>
							<media-playback-rate-button></media-playback-rate-button>
							<media-mute-button></media-mute-button>
							<media-volume-range></media-volume-range>
						</media-control-bar>
					</media-controller>

					<span v-else class="text-light-100">Sorry but this file can't be previewd at this time.</span>
				</div>

				<!-- File information panel -->
				<div class="flex flex-col w-1/3 pl-4 mobile:w-full pt-4">
					<div class="flex justify-between mobile:mt-4 gap-2">
						<Button class="flex-1" @click="copyLink">{{ isCopying ? 'Copied!' : 'Copy link' }}</Button>
						<Button as="a" :href="file.url" target="_blank" rel="noopener noreferrer" class="flex-1">
							Open
						</Button>
						<ConfirmationDialog
							v-if="props.type === 'admin' && !file.quarantine"
							title="Quarantine file"
							message="The file will be quarantined and gone temporarily. Are you sure?"
							proceedText="Quarantine"
							:callback="doQuarantineFile"
						>
							<Button>Quarantine</Button></ConfirmationDialog
						>
						<ConfirmationDialog
							v-if="props.type === 'admin' && file.quarantine"
							title="Allow file"
							message="The file will be un-quarantined and be available again. Are you sure?"
							proceedText="Allow"
							:callback="doAllowFile"
							><Button>Allow</Button></ConfirmationDialog
						>
						<ConfirmationDialog
							title="Delete file"
							message="The file will be deleted and gone forever with no way to recover it. It will also remove it from any albums that you added it to. Are you sure?"
							proceedText="Delete"
							:callback="doDeleteFile"
							><Button>Delete</Button></ConfirmationDialog
						>
					</div>

					<h2 class="text-light-100 mt-1">File info</h2>

					<InputWithOverlappingLabel :value="file.uuid" class="mt-4" label="UUID" readOnly />
					<InputWithOverlappingLabel :value="file.name" class="mt-4" label="Name" readOnly />
					<InputWithOverlappingLabel :value="file.original" class="mt-4" label="Original Name" readOnly />
					<InputWithOverlappingLabel
						:value="file.ip"
						class="mt-4"
						label="IP"
						type="link"
						:href="`/dashboard/admin/ip/${file.ip}`"
						readOnly
					/>
					<InputWithOverlappingLabel
						:value="file.url"
						class="mt-4"
						label="Link"
						type="link"
						:href="file.url"
						readOnly
					/>
					<InputWithOverlappingLabel
						:value="String(formatBytes(file.size))"
						class="mt-4"
						label="Size"
						readOnly
					/>
					<InputWithOverlappingLabel :value="file.hash" class="mt-4" label="Hash" readOnly />
					<InputWithOverlappingLabel
						:value="dayjs(file.createdAt).format('MMMM D, YYYY h:mm A')"
						class="mt-4"
						label="Uploaded"
						readOnly
					/>

					<!-- Albums and Tags information section -->
					<template v-if="type === 'album' || type === 'uploads'">
						<h2 class="text-light-100 mt-8 mb-4">Albums</h2>
						<Combobox
							:data="albumsForCombobox"
							placeholder="Select album..."
							@selected="doAddFileToAlbum"
						></Combobox>

						<div>
							<Badge
								v-for="album in fileAlbums"
								:key="album.uuid"
								variant="default"
								class="text-sm mr-2 mt-2 bg-dark-100"
							>
								{{ album.name }}
								<span class="ml-2 cursor-pointer" @click="doRemoveFileFromAlbum(album.uuid)">
									<svg viewBox="0 0 14 14" class="h-3.5 w-3.5 stroke-white">
										<path d="M4 4l6 6m0-6l-6 6" />
									</svg>
								</span>
							</Badge>
						</div>
					</template>

					<!-- User information section -->
					<template v-else>
						<h2 class="text-light-100 mt-8">User info</h2>
						<InputWithOverlappingLabel
							:value="file.user?.username"
							class="mt-4"
							label="Username"
							readOnly
							type="link"
							:href="`/dashboard/admin/user/${file.user?.uuid}`"
						/>
						<InputWithOverlappingLabel :value="file.user?.uuid" class="mt-4" label="UUID" readOnly />
						<InputWithOverlappingLabel
							:value="String(file.user?.enabled)"
							class="mt-4"
							label="Enabled"
							readOnly
						/>
						<InputWithOverlappingLabel
							:value="String(file.user?.roles.map((role: any) => role.name).join(', '))"
							class="mt-4"
							label="Roles"
							readOnly
						/>
						<InputWithOverlappingLabel
							:value="dayjs(file.user?.createdAt).format('MMMM D, YYYY h:mm A')"
							class="mt-4"
							label="Created at"
							readOnly
						/>
					</template>
					<!-- User information section -->
				</div>
				<!-- File information panel -->
			</div>
		</DialogContent>
	</Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatBytes, isFileVideo, isFileImage, isFileAudio } from '~/use/file';
import { useClipboard } from '@vueuse/core';
import { useUserStore } from '~/store';
import {
	deleteFile,
	deleteFileAsAdmin,
	allowFileAsAdmin,
	quarantineFileAsAdmin,
	addFileToAlbum,
	removeFileFromAlbum,
	getFile
} from '~/use/api';
import InputWithOverlappingLabel from '~/components/forms/InputWithOverlappingLabel.vue';
import ConfirmationDialog from '~/components/dialogs/ConfirmationDialog.vue';
import { toast } from 'vue-sonner';
import dayjs from 'dayjs';
import { Album, FileWithAdditionalData } from '@/types';
import Combobox from '@/components/combobox/Combobox.vue';
import { useAlbumsStore } from '@/store';
import { Badge } from '@/components/ui/badge';

interface Props {
	file: FileWithAdditionalData;
	type?: 'admin' | 'album' | 'uploads';
}

const props = withDefaults(defineProps<Props>(), {
	file: undefined,
	type: 'uploads'
});

const albumsStore = useAlbumsStore();
const userStore = useUserStore();
const isAdmin = computed(() => userStore.user.loggedIn);
const fileAlbums = ref<Album[]>([]);

const onOpen = async (isOpen: boolean) => {
	if (!isOpen) return;
	void albumsStore.get();
	void getFileAlbums();
};

const getFileAlbums = async () => {
	if (!props.file) return;
	const file = await getFile(props.file.uuid);
	fileAlbums.value = file.albums;
};

const albumsForCombobox = computed(() => {
	return albumsStore.albums
		.filter(album => !fileAlbums.value.some(fileAlbum => fileAlbum.uuid === album.uuid))
		.map(album => ({
			value: album.uuid,
			label: album.name
		}));
});

const { copy } = useClipboard();
const isCopying = ref(false);

const doAddFileToAlbum = async (uuid: string) => {
	await addFileToAlbum(props.file.uuid, uuid);
	await getFileAlbums();
};

const doRemoveFileFromAlbum = async (uuid: string) => {
	await removeFileFromAlbum(props.file.uuid, uuid);
	await getFileAlbums();
};

const copyLink = () => {
	if (isCopying.value) return;
	isCopying.value = true;

	if (props.file?.url) void copy(props.file?.url);
	// eslint-disable-next-line no-restricted-globals
	setTimeout(() => (isCopying.value = false), 1000);
};

const doQuarantineFile = () => {
	if (!props.file) return;

	// If the user is an admin, we need to use the admin endpoint
	void quarantineFileAsAdmin(props.file.uuid);

	// filesStore.removeFile(props.file.uuid);
	toast.success('File quarantined');
	// closeModal();
};

const doAllowFile = () => {
	if (!props.file) return;

	// If the user is an admin, we need to use the admin endpoint
	void allowFileAsAdmin(props.file.uuid);

	// filesStore.removeFile(props.file.uuid);
	toast.success('File allowed');
	// closeModal();
};

const doDeleteFile = () => {
	if (!props.file) return;

	// If the user is an admin, we need to use the admin endpoint
	if (isAdmin.value) void deleteFileAsAdmin(props.file.uuid);
	// Otherwise, we can use the normal endpoint
	else void deleteFile(props.file.uuid);

	// filesStore.removeFile(file.value.uuid);
	toast.success('File deleted');
	// closeModal();
};
</script>
