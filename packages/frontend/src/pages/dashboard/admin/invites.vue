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
				<div class="items-center my-8">
					<Button @click="doCreateInvite">Create invite</Button>
				</div>
			</div>
			<Table :invites="invites" class="mt-12 bg-dark-110" />
		</div>
	</ScrollArea>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getInvites, createInvite } from '~/use/api';
import { debug } from '~/use/log';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Table from '~/components/table/InvitesTable.vue';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';

const invites = ref([]);
onMounted(async () => {
	void loadInvites();
});

const loadInvites = async () => {
	const response = await getInvites();
	if (!response) return;
	invites.value = response.invites;
};

const doCreateInvite = async () => {
	const response = await createInvite();
	if (!response) return;
	debug(response);
	void loadInvites();
	// invites.value = response.users;
};
</script>
