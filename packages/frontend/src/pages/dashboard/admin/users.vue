<template>
	<Sidebar>
		<div class="mx-auto max-w-7xl px-6">
			<Breadcrumbs
				:pages="[
					{
						name: 'Admin',
						href: '/dashboard/admin/files'
					},
					{
						name: 'Users',
						href: '/dashboard/admin/users'
					}
				]"
			/>
			<h1 class="text-2xl mt-8 font-semibold text-light-100">Registered users</h1>
			<Table :users="users" class="mt-12 bg-dark-110" />
		</div>
	</Sidebar>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getUsersAdmin } from '~/use/api';
import Sidebar from '~/components/sidebar/Sidebar.vue';
import Table from '~/components/table/UsersTable.vue';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';

const users = ref([]);
onMounted(async () => {
	const response = await getUsersAdmin();
	if (!response) return;
	users.value = response.users;
});
</script>
