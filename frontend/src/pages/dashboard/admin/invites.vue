<template>
	<Sidebar>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-screen overflow-auto">
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
			<h1 class="text-2xl mt-8 font-semibold text-light-100 flex items-center">
				Invites
				<span class="grow h-1 w-full"></span>

				<div class="items-center my-8">
					<button
						type="button"
						class="bg-green-700 hover:bg-green-800 text-light-100 font-semibold py-2 px-4 rounded items-center w-64 text-center text-base"
						@click="doCreateInvite"
					>
						Create invite
					</button>
				</div>
			</h1>
			<Table :invites="invites" class="mt-12 bg-dark-110" />
		</div>
	</Sidebar>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getInvites, createInvite } from '~/use/api';
import Sidebar from '~/components/sidebar/Sidebar.vue';
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
