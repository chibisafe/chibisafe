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
						name: 'Invites',
						href: '/dashboard/admin/invites'
					}
				]"
			/>
			<div class="mt-8 font-semibold text-light-100 flex items-center justify-between">
				<h1 class="text-2xl desktop:whitespace-nowrap">Invites</h1>
				<div class="items-center">
					<Button @click="doCreateInvite">Create invite</Button>
				</div>
			</div>
			<InvitesTable :invites="invites" class="mt-12 bg-dark-110" />
		</div>
	</ScrollArea>
</template>

<script setup lang="ts">
import { useQuery, useQueryClient, useMutation } from '@tanstack/vue-query';
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';
import InvitesTable from '~/components/table/InvitesTable.vue';
import { getInvites, createInvite } from '~/use/api';

const queryClient = useQueryClient();
const { mutate: mutateCreateFile } = useMutation({
	mutationFn: () => createInvite()
});

const invites = computed(() => data.value?.invites ?? []);

const { data } = useQuery({
	queryKey: ['invites'],
	queryFn: () => getInvites(),
	placeholderData: (previousData: any) => previousData
});

const doCreateInvite = async () => {
	mutateCreateFile(undefined, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['invites'] });
		}
	});
};
</script>
