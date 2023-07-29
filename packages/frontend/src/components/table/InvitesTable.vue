<template>
	<table class="min-w-full divide-y divide-gray-500">
		<thead class="bg-dark-80">
			<tr>
				<th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-light-100 desktop:pl-6">
					Code
				</th>
				<th
					scope="col"
					class="hidden px-3 py-3.5 text-left text-sm font-semibold text-light-100 desktop:table-cell"
				>
					Status
				</th>
				<th
					scope="col"
					class="hidden px-3 py-3.5 text-left text-sm font-semibold text-light-100 desktop:table-cell"
				>
					Created by
				</th>
				<th
					scope="col"
					class="hidden px-3 py-3.5 text-left text-sm font-semibold text-light-100 desktop:table-cell"
				>
					Created at
				</th>
				<th
					scope="col"
					class="hidden px-3 py-3.5 text-left text-sm font-semibold text-light-100 desktop:table-cell"
				>
					Claimed by
				</th>
				<th
					scope="col"
					class="hidden px-3 py-3.5 text-left text-sm font-semibold text-light-100 desktop:table-cell"
				>
					Claimed at
				</th>
				<th
					scope="col"
					class="px-3 py-3.5 text-left text-sm font-semibold text-light-100 desktop:table-cell"
				></th>
			</tr>
		</thead>
		<tbody class="divide-y divide-gray-500">
			<tr
				v-for="(invite, indexInvite) in invites"
				:key="invite.code"
				:class="indexInvite % 2 === 0 ? ' bg-dark-90' : 'bg-dark-80'"
			>
				<td
					class="w-full px-3 max-w-0 py-4 pl-4 pr-3 font-normal text-light-100 desktop:w-auto desktop:max-w-none desktop:pl-6 underline"
				>
					<a :href="`/invite/${invite.code}`" target="_blank" rel="noopener noreferrer">{{ invite.code }}</a>
				</td>
				<td class="hidden px-3 py-4 text-sm text-light-100 desktop:table-cell">
					{{ invite.used ? 'Used' : 'Available' }}
				</td>
				<td class="hidden px-3 py-4 text-sm text-light-100 desktop:table-cell">
					{{ invite.createdBy.username }}
				</td>
				<td class="hidden px-3 py-4 text-sm text-light-100 desktop:table-cell">
					{{ dayjs(invite.createdAt).format('MMMM D, YYYY h:mm A') }}
				</td>
				<td class="hidden px-3 py-4 text-sm text-light-100 desktop:table-cell">
					{{ invite.usedBy ? invite.usedBy.username : 'N/A' }}
				</td>
				<td class="hidden px-3 py-4 text-sm text-light-100 desktop:table-cell">
					{{ invite.editedAt ? dayjs(invite.editedAt).format('MMMM D, YYYY h:mm A') : 'N/A' }}
				</td>
				<td class="py-4 pl-3 pr-4 text-right text-sm font-medium desktop:pr-6 text-light-100">
					<button v-if="!invite.used" type="button" class="ml-4" @click="doCancelInvite(invite)">
						Revoke
					</button>
				</td>
			</tr>
		</tbody>
		<ManageUserModal />
	</table>
</template>

<script setup lang="ts">
import type { Invite } from '@/types';
import { cancelInvite } from '~/use/api';
import ManageUserModal from '~/components/modals/ManageUserModal.vue';
import dayjs from 'dayjs';

const props = defineProps<{
	invites: Invite[];
}>();

const doCancelInvite = async (invite: Invite) => {
	await cancelInvite(invite.code);
};
</script>
