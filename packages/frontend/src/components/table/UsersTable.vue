<template>
	<table class="min-w-full divide-y divide-gray-500">
		<thead class="bg-dark-80">
			<tr>
				<th
					scope="col"
					class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-dark-90 dark:text-light-100 desktop:pl-6"
				>
					Username
				</th>
				<th
					scope="col"
					class="px-3 py-3.5 text-left text-sm font-semibold text-dark-90 dark:text-light-100 desktop:table-cell"
				>
					Files
				</th>
				<th
					scope="col"
					class="hidden px-3 py-3.5 text-left text-sm font-semibold text-dark-90 dark:text-light-100 desktop:table-cell"
				>
					Status
				</th>
				<th
					scope="col"
					class="hidden px-3 py-3.5 text-left text-sm font-semibold text-dark-90 dark:text-light-100 desktop:table-cell"
				>
					Role
				</th>
				<th
					scope="col"
					class="hidden px-3 py-3.5 text-left text-sm font-semibold text-dark-90 dark:text-light-100 desktop:table-cell"
				>
					Space used
				</th>
				<th
					scope="col"
					class="hidden px-3 py-3.5 text-left text-sm font-semibold text-dark-90 dark:text-light-100 desktop:table-cell"
				>
					Created
				</th>
				<th
					scope="col"
					class="px-3 py-3.5 text-left text-sm font-semibold text-dark-90 dark:text-light-100 desktop:table-cell"
				></th>
			</tr>
		</thead>
		<tbody class="divide-y divide-gray-500">
			<tr
				v-for="(user, indexUser) in users"
				:key="user.uuid"
				:class="indexUser % 2 === 0 ? ' bg-dark-90' : 'bg-dark-80'"
			>
				<td
					class="w-full px-3 max-w-0 py-4 pl-4 pr-3 font-normal text-dark-90 dark:text-light-100 desktop:w-auto desktop:max-w-none desktop:pl-6 underline"
				>
					<router-link :to="`/dashboard/admin/user/${user.uuid}`">{{ user.username }}</router-link>
				</td>
				<td class="px-3 py-4 text-sm text-dark-90 dark:text-light-100 desktop:table-cell">
					{{ user._count.files }}
				</td>
				<td class="hidden px-3 py-4 text-sm text-dark-90 dark:text-light-100 desktop:table-cell">
					{{ user.enabled ? 'Enabled' : 'Disabled' }}
				</td>
				<td class="hidden px-3 py-4 text-sm text-dark-90 dark:text-light-100 desktop:table-cell">
					{{ user.isAdmin ? 'Admin' : 'User' }}
				</td>
				<td class="hidden px-3 py-4 text-sm text-dark-90 dark:text-light-100 desktop:table-cell">
					{{ formatBytes(Number(user.size)) }}
				</td>
				<td class="hidden px-3 py-4 text-sm text-dark-90 dark:text-light-100 desktop:table-cell">
					{{ dayjs(user.createdAt).format('MMMM D, YYYY h:mm A') }}
				</td>
				<td class="py-4 pl-3 pr-4 text-right text-sm font-medium desktop:pr-6 text-dark-90 dark:text-light-100">
					<router-link :to="`/dashboard/admin/user/${user.uuid}`" class="underline">View files</router-link>
					<!-- Only show one action if we're the user on the table -->
					<template v-if="user.uuid === ownUser.uuid">
						<button type="button" class="ml-4" @click="showManageUserModal(user, 'purge')">
							Purge files
						</button>
					</template>
					<template v-else>
						<button
							v-if="user.enabled"
							type="button"
							class="ml-4"
							@click="showManageUserModal(user, 'disable')"
						>
							Disable
						</button>
						<button v-else type="button" class="ml-4" @click="showManageUserModal(user, 'enable')">
							Enable
						</button>
						<button
							v-if="user.isAdmin"
							type="button"
							class="ml-4"
							@click="showManageUserModal(user, 'demote')"
						>
							Demote
						</button>
						<button v-else type="button" class="ml-4" @click="showManageUserModal(user, 'promote')">
							Promote
						</button>
						<button type="button" class="ml-4" @click="showManageUserModal(user, 'purge')">
							Purge files
						</button>
					</template>
				</td>
			</tr>
		</tbody>
		<ManageUserModal />
	</table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { UserWithCount } from '@/types';
import { formatBytes } from '~/use/file';
import { useModalStore, useUserStore } from '~/store';
import ManageUserModal from '~/components/modals/ManageUserModal.vue';
import dayjs from 'dayjs';

const props = defineProps<{
	users: UserWithCount[];
}>();

const modalsStore = useModalStore();
const userStore = useUserStore();

const ownUser = computed(() => userStore.user);

const showManageUserModal = (user: UserWithCount | null, action: string) => {
	if (!user) return;

	modalsStore.manageUser.user = user;
	modalsStore.manageUser.action = action;
	modalsStore.manageUser.show = true;
};
</script>
