<template>
	<Dialog @update:open="onOpen">
		<DialogTrigger v-if="hasDefaultSlot">
			<slot />
		</DialogTrigger>
		<DialogTrigger
			v-else
			class="h-full w-full absolute"
			as="a"
			:href="file?.url"
			target="_blank"
			rel="noopener noreferrer"
			variant="none"
			@click.left.stop="event => event.preventDefault()"
		/>
		<DialogContent
			class="max-w-[calc(100vw-8rem)] mobile:max-w-[calc(100vw-2rem)] mobile:h-[calc(100vh-4rem)] h-[calc(100vh-8rem)] min-h-40 duration-100"
			:class="[isVerticalImage ? '!w-fit' : '!w-max']"
		>
			<div class="grid grid-cols-[1fr,400px] gap-4">
				<div
					class="w-full"
					:class="[isFileImage(file) || isFileVideo(file) ? 'h-[calc(100vh-11rem)]' : 'h-auto']"
				>
					<img
						v-if="isFileImage(file)"
						ref="fileElement"
						:src="file.url"
						class="h-full object-contain hidden md:block"
						@load="onImageLoad"
					/>
					<media-controller v-else-if="isFileVideo(file)" class="h-full hidden md:block">
						<!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
						<video slot="media" :src="file.url" crossorigin="" class="h-full"></video>
						<media-control-bar>
							<media-play-button></media-play-button>
							<media-mute-button></media-mute-button>
							<media-volume-range></media-volume-range>
							<media-time-range></media-time-range>
							<media-pip-button></media-pip-button>
							<media-fullscreen-button></media-fullscreen-button>
						</media-control-bar>
					</media-controller>

					<media-controller v-else-if="isFileAudio(file)" audio class="hidden md:block">
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

					<span v-else class="text-light-100 h-full items-center hidden md:flex"
						>Sorry but this file can't be previewed at this time.</span
					>
				</div>

				<!-- File information panel -->
				<ScrollArea
					class="max-w-[400px] h-[calc(100vh-11rem)] mobile:max-w-[calc(100vw-7rem)] mobile:h-[calc(100vh-7rem)] min-h-32"
				>
					<div class="flex flex-col mobile:max-w-[calc(100vw-7rem)]">
						<div class="mb-8">
							<h2 class="text-light-100 mb-2">Actions</h2>
							<div class="flex justify-between gap-2 flex-wrap mobile:flex-col">
								<Button class="flex-1" @click="copyLink">{{
									isCopying ? 'Copied!' : 'Copy link'
								}}</Button>
								<Button
									as="a"
									:href="file.url"
									target="_blank"
									rel="noopener noreferrer"
									class="flex-1 w-full"
								>
									Open
								</Button>
								<ConfirmationDialog
									title="Delete file"
									message="The file will be deleted and gone forever with no way to recover it. It will also remove it from any albums that you added it to. Are you sure?"
									proceedText="Delete"
									:callback="doDeleteFile"
									><Button variant="destructive">Delete</Button></ConfirmationDialog
								>
								<div class="basis-full h-0"></div>
								<ConfirmationDialog
									v-if="isFileImage(file) || isFileVideo(file)"
									title="Regenerate thumbnail"
									message="If the file has a broken thumbnail this will try to fix that. Are you sure?"
									proceedText="Continue"
									:callback="doRegenerateThumbnail"
								>
									<Button>Regenerate thumbnail</Button></ConfirmationDialog
								>
								<Button as="a" :href="file.url" :download="file.original" class="flex-1">
									Download
								</Button>
								<ConfirmationDialog
									v-if="isAdmin && !file.quarantine"
									title="Quarantine file"
									message="The file will be quarantined and gone temporarily. Are you sure?"
									proceedText="Quarantine"
									:callback="doQuarantineFile"
								>
									<Button variant="destructive">Quarantine</Button></ConfirmationDialog
								>
								<ConfirmationDialog
									v-if="isAdmin && file.quarantine"
									title="Allow file"
									message="The file will be un-quarantined and be available again. Are you sure?"
									proceedText="Allow"
									:callback="doAllowFile"
									><Button variant="destructive">Allow</Button></ConfirmationDialog
								>
							</div>
						</div>

						<div class="mb-8">
							<h2 class="text-light-100">File info</h2>

							<InputWithOverlappingLabel :value="file.uuid" class="mt-4" label="UUID" readOnly />
							<InputWithOverlappingLabel :value="file.name" class="mt-4" label="Name" readOnly />
							<InputWithOverlappingLabel
								:value="file.original"
								class="mt-4"
								label="Original Name"
								readOnly
							/>
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
						</div>

						<!-- Albums section -->
						<div v-if="type === 'album' || type === 'uploads' || type === 'tag'" class="mb-8">
							<h2 class="text-light-100">Albums</h2>
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
						</div>

						<!-- Tags -->
						<div v-if="type === 'album' || type === 'uploads' || type === 'tag'" class="mb-8">
							<h2 class="text-light-100">Tags</h2>
							<TagBox
								:tags="tags"
								:fileTags="fileTags"
								@selected="doAddFileToTag"
								@tag:clicked="doRemoveFileFromTag"
							/>
						</div>

						<!-- User information section -->
						<div v-else class="mb-8">
							<h2 class="text-light-100">User info</h2>
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
						</div>
						<!-- User information section -->
					</div>
				</ScrollArea>
				<!-- File information panel -->
			</div>
		</DialogContent>
	</Dialog>
</template>

<script setup lang="ts">
import { useQueryClient, useMutation, useQuery } from '@tanstack/vue-query';
import { useClipboard } from '@vueuse/core';
import dayjs from 'dayjs';
import { ref, computed, nextTick, useSlots } from 'vue';
import { toast } from 'vue-sonner';
import Combobox from '@/components/combobox/Combobox.vue';
import TagBox from '@/components/tags/TagBox.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAlbumsStore } from '@/store';
import { Album, FileWithAdditionalData, Tag, FilePropsType } from '@/types';
import ConfirmationDialog from '~/components/dialogs/ConfirmationDialog.vue';
import InputWithOverlappingLabel from '~/components/forms/InputWithOverlappingLabel.vue';
import {
	deleteFile,
	deleteFileAsAdmin,
	allowFileAsAdmin,
	quarantineFileAsAdmin,
	addFileToAlbum,
	removeFileFromAlbum,
	getFile,
	regenerateThumbnail,
	getTags,
	addFileToTag,
	removeFileFromTag
} from '~/use/api';
import { formatBytes, isFileVideo, isFileImage, isFileAudio } from '~/use/file';

interface Props {
	file: FileWithAdditionalData;
	type?: FilePropsType;
}

const props = withDefaults(defineProps<Props>(), {
	type: 'uploads'
});

const slots = useSlots();
const hasDefaultSlot = computed(() => Boolean(slots.default));

const albumsStore = useAlbumsStore();
const isAdmin = props.type === 'admin' || props.type === 'quarantine';
const fileAlbums = ref<Album[]>([]);
const fileTags = ref<Tag[]>([]);
const fileElement = ref<HTMLElement | null>(null);
const isVerticalImage = ref(false);

const onImageLoad = async () => {
	if (!fileElement.value) return;
	await nextTick();
	isVerticalImage.value = fileElement.value.clientHeight > fileElement.value.clientWidth;
};

const queryClient = useQueryClient();

const { mutate: mutateDeleteFile } = useMutation({
	mutationFn: (uuid: string) => (isAdmin ? deleteFileAsAdmin(uuid) : deleteFile(uuid))
});

const { mutate: mutateQuarantineFile } = useMutation({
	mutationFn: (uuid: string) => quarantineFileAsAdmin(uuid)
});

const { mutate: mutateAllowFile } = useMutation({
	mutationFn: (uuid: string) => allowFileAsAdmin(uuid)
});

const { mutate: mutateRegenerateThumbnail } = useMutation({
	mutationFn: (uuid: string) => regenerateThumbnail(uuid)
});

const onOpen = async (isOpen: boolean) => {
	if (!isOpen) return;
	void albumsStore.get();
	void getFileInformation();
};

const getFileInformation = async () => {
	if (props.type === 'admin') return;
	const file = await getFile(props.file.uuid);
	fileAlbums.value = file.albums;
	fileTags.value = file.tags;
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
	await getFileInformation();
};

const doRemoveFileFromAlbum = async (uuid: string) => {
	await removeFileFromAlbum(props.file.uuid, uuid);
	await getFileInformation();
};

const doAddFileToTag = async ({ uuid, name }: { uuid: string; name: string }) => {
	await addFileToTag(props.file.uuid, uuid);
	queryClient.invalidateQueries({ queryKey: ['tags'] });
	fileTags.value.push({ uuid, name });
};

const doRemoveFileFromTag = async ({ uuid }: { uuid: string }) => {
	await removeFileFromTag(props.file.uuid, uuid);
	fileTags.value = fileTags.value.filter(tag => tag.uuid !== uuid);
};

const copyLink = () => {
	if (isCopying.value) return;
	isCopying.value = true;

	if (props.file?.url) void copy(props.file?.url);
	// eslint-disable-next-line no-restricted-globals
	setTimeout(() => (isCopying.value = false), 1000);
};

const doQuarantineFile = () => {
	mutateQuarantineFile(props.file.uuid, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'files'] });
			toast.success('File quarantined');
		}
	});
};

const doAllowFile = () => {
	mutateAllowFile(props.file.uuid, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'files'] });
			toast.success('File allowed');
		}
	});
};

const doDeleteFile = () => {
	mutateDeleteFile(props.file.uuid, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: isAdmin ? ['admin', 'files'] : ['files'] });
			toast.success('File deleted');
		}
	});
};

const doRegenerateThumbnail = () => {
	mutateRegenerateThumbnail(props.file.uuid, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: isAdmin ? ['admin', 'files'] : ['files'] });
			toast.success('Thumbnail regenerated');
		}
	});
};

const { data: tags } = useQuery({
	queryKey: ['tags'],
	queryFn: async () => {
		const data = await getTags();
		return data.sort((a: any, b: any) => {
			return b._count.files - a._count.files;
		});
	},
	placeholderData: (previousData: any) => previousData
});
</script>
