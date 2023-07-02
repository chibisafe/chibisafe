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
			<SwitchGroup>
				<div class="flex items-center mt-8">
					<SwitchLabel class="mr-4 dark:text-light-100">Hide disabled users</SwitchLabel>
					<Switch
						v-model="hideDisabledUsers"
						class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 dark:border-gray-600"
						:class="[hideDisabledUsers ? 'bg-blue-400' : 'bg-gray-200']"
					>
						<span class="sr-only">Hide disabled users</span>
						<span
							aria-hidden="true"
							class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out dark:bg-dark-90"
							:class="[hideDisabledUsers ? 'translate-x-5' : 'translate-x-0']"
						/>
					</Switch>
				</div>
			</SwitchGroup>
			<Table v-if="filteredUsers" :users="filteredUsers" class="mt-12 bg-dark-110" />
		</div>
	</Sidebar>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getUsersAdmin } from '~/use/api';
import Sidebar from '~/components/sidebar/Sidebar.vue';
import Table from '~/components/table/UsersTable.vue';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';
import { Switch, SwitchLabel, SwitchGroup } from '@headlessui/vue';
import type { UserWithCount } from '~/types';

const hideDisabledUsers = ref(false);
const users = ref<UserWithCount[]>();

const filteredUsers = computed(() => {
	if (!users.value) return [];
	return hideDisabledUsers.value ? users.value.filter(user => user.enabled) : users.value;
});

onMounted(async () => {
	const response = await getUsersAdmin();
	if (!response) return;
	users.value = response.users;
});
</script>
