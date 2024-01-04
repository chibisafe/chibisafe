<template>
	<ScrollArea class="w-full">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<Breadcrumbs
				:pages="[
					{
						name: 'Admin',
						href: '/dashboard/admin/files'
					},
					{
						name: 'Users',
						href: '/dashboard/admin/users'
					},
					{
						name: data?.files?.[0]?.user.username,
						href: '/dashboard/admin/user/' + props.uuid
					}
				]"
			/>
			<h1 class="text-2xl mt-8 font-semibold text-light-100">
				{{ data?.files?.[0]?.user.username }} uploads ({{ data?.count }} files)
			</h1>
			<FilesWrapper type="admin" :userUuid="userUuid" />
		</div>
	</ScrollArea>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getFilesFromUser } from '@/use/api';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';
import FilesWrapper from '~/components/wrappers/FilesWrapper.vue';

const props = defineProps<{
	uuid: string;
}>();

const userUuid = computed(() => props.uuid);

const { data } = useQuery({
	queryKey: ['admin', 'user', userUuid, 'files'],
	queryFn: () => getFilesFromUser(props.uuid, 1, 1),
	placeholderData: (previousData: any) => previousData
});
</script>
