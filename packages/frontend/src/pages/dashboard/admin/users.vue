<template>
	<ScrollArea class="w-full">
		<div class="mx-auto max-w-7xl px-6 mobile:px-4">
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
					<SwitchLabel class="mr-4 text-light-100">Hide disabled users</SwitchLabel>
					<Switch
						v-model="hideDisabledUsers"
						class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 border-gray-600"
						:class="[hideDisabledUsers ? 'bg-blue-400' : 'bg-gray-200']"
					>
						<span class="sr-only">Hide disabled users</span>
						<span
							aria-hidden="true"
							class="pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out bg-dark-90"
							:class="[hideDisabledUsers ? 'translate-x-5' : 'translate-x-0']"
						/>
					</Switch>
				</div>
			</SwitchGroup>
			<UsersTable v-if="filteredUsers" :data="filteredUsers" class="mt-12 bg-dark-110" />
		</div>
	</ScrollArea>
</template>

<script setup lang="ts">
import { Switch, SwitchLabel, SwitchGroup } from '@headlessui/vue';
import { ref, computed, onMounted } from 'vue';
import UsersTable from '@/components/table/UsersTable.vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';
import type { UserWithCount } from '~/types';
import { getUsersAdmin } from '~/use/api';

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
