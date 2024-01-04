<template>
	<ScrollArea class="w-full">
		<div class="mx-auto max-w-7xl px-4 desktop:px-6 mobile:px-8">
			<Breadcrumbs
				:pages="[
					{
						name: 'Tags',
						href: '/dashboard/tags'
					}
				]"
			/>
			<div class="text-2xl mt-8 font-semibold text-light-100 flex items-center">
				<h1>You have {{ tags?.length }} tag{{ tags?.length > 1 ? 's' : '' }}</h1>
			</div>
			<div class="mt-8 pb-16">
				<ul
					role="list"
					class="mt-3 grid grid-cols-1 gap-5 desktop:grid-cols-3 desktop:gap-6 mobile:grid-cols-1"
				>
					<li
						v-for="tag in tags"
						:key="tag.uuid"
						class="col-span-1 flex rounded-md shadow-sm hover:shadow-lg cursor-pointer h-16 w-full border rounded-l border-dark-90"
					>
						<router-link :to="`/dashboard/tags/${tag.uuid}`" class="flex w-full truncate">
							<div class="flex flex-1 items-center truncate bg-dark-110">
								<div class="flex-1 flex-row px-4 py-2 text-sm w-full overflow-hidden truncate">
									<span class="font-medium hover:text-white text-light-100 truncate block">
										{{ tag.name }}
									</span>

									<span v-if="tag._count.files" class="text-gray-400 block">
										{{ tag._count.files }} file{{ tag._count.files > 1 ? 's' : '' }}
									</span>
								</div>
							</div>
						</router-link>
						<div
							class="flex-shrink-0 w-16 text-white text-sm font-medium border-l bg-dark-110 border-dark-90"
						>
							<ConfirmationDialog
								title="Delete tag"
								message="Are you sure you want to delete this tag?"
								:callback="() => onDeleteTag(tag.uuid)"
							>
								<div class="w-full h-full flex items-center justify-center">
									<Trash2Icon />
								</div>
							</ConfirmationDialog>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</ScrollArea>
</template>

<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { Trash2Icon } from 'lucide-vue-next';
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs.vue';
import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog.vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getTags, deleteTag } from '@/use/api';

const queryClient = useQueryClient();

const onDeleteTag = async (uuid: string) => {
	await deleteTag(uuid);
	queryClient.invalidateQueries({ queryKey: ['tags'] });
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
