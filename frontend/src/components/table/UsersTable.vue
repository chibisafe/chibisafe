<template>
	<table class="min-w-full divide-y divide-gray-500">
		<thead class="bg-new-background">
			<tr>
				<th
					scope="col"
					class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-dark-90 dark:text-light-100 sm:pl-6"
				>
					Username
				</th>
				<th
					scope="col"
					class="hidden px-3 py-3.5 text-left text-sm font-semibold text-dark-90 dark:text-light-100 sm:table-cell"
				>
					Files
				</th>
				<th
					scope="col"
					class="hidden px-3 py-3.5 text-left text-sm font-semibold text-dark-90 dark:text-light-100 sm:table-cell"
				>
					Enabled
				</th>
				<th
					scope="col"
					class="hidden px-3 py-3.5 text-left text-sm font-semibold text-dark-90 dark:text-light-100 sm:table-cell"
				>
					Admin
				</th>
				<th
					scope="col"
					class="hidden px-3 py-3.5 text-left text-sm font-semibold text-dark-90 dark:text-light-100 sm:table-cell"
				>
					Space used
				</th>
				<th
					scope="col"
					class="hidden px-3 py-3.5 text-left text-sm font-semibold text-dark-90 dark:text-light-100 sm:table-cell"
				>
					Created
				</th>
				<th
					scope="col"
					class="px-3 py-3.5 text-left text-sm font-semibold text-dark-90 dark:text-light-100 sm:table-cell"
				></th>
			</tr>
		</thead>
		<tbody class="divide-y divide-gray-500">
			<tr
				v-for="(user, indexUser) in users"
				:key="user.uuid"
				:class="indexUser % 2 === 0 ? ' bg-new-block' : 'bg-new-background'"
			>
				<td
					class="w-full px-3 max-w-0 py-4 pl-4 pr-3 font-normal text-dark-90 dark:text-light-100 sm:w-auto sm:max-w-none sm:pl-6 underline"
				>
					<router-link :to="`/dashboard/admin/user/${user.uuid}`">{{ user.username }}</router-link>
				</td>
				<td class="hidden px-3 py-4 text-sm text-dark-90 dark:text-light-100 sm:table-cell">
					{{ user._count.files }}
				</td>
				<td class="hidden px-3 py-4 text-sm text-dark-90 dark:text-light-100 sm:table-cell">
					{{ user.enabled }}
				</td>
				<td class="hidden px-3 py-4 text-sm text-dark-90 dark:text-light-100 sm:table-cell">
					{{ user.isAdmin }}
				</td>
				<td class="hidden px-3 py-4 text-sm text-dark-90 dark:text-light-100 sm:table-cell">
					{{ formatBytes(Number(user.size)) }}
				</td>
				<td class="hidden px-3 py-4 text-sm text-dark-90 dark:text-light-100 sm:table-cell">
					{{ user.createdAt }}
				</td>
				<td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 text-dark-90 dark:text-light-100">
					<router-link :to="`/dashboard/admin/user/${user.uuid}`" class="underline">View files</router-link>
					<button type="button" class="ml-4">Delete</button>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { UserWithCount } from '@/types';
import { formatBytes } from '~/use/file';

const props = defineProps<{
	users: UserWithCount[];
}>();
</script>
