<template>
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead class="text-center">Code</TableHead>
				<TableHead class="text-center">Status</TableHead>
				<TableHead class="text-center">Created by</TableHead>
				<TableHead class="text-center">Created at</TableHead>
				<TableHead class="text-center">Claimed by</TableHead>
				<TableHead class="text-center">Claimed at</TableHead>
				<TableHead class="text-right" />
			</TableRow>
		</TableHeader>
		<TableBody>
			<TableRow v-for="invite in invites" :key="invite.code">
				<TableCell>
					<a :href="`/invite/${invite.code}`" target="_blank" rel="noopener noreferrer">{{ invite.code }}</a>
				</TableCell>
				<TableCell>
					{{ invite.used ? 'Used' : 'Available' }}
				</TableCell>
				<TableCell>
					{{ invite.createdBy.username }}
				</TableCell>
				<TableCell>
					{{ dayjs(invite.createdAt).format('MMMM D, YYYY h:mm A') }}
				</TableCell>
				<TableCell>
					{{ invite.usedBy ? invite.usedBy.username : 'N/A' }}
				</TableCell>
				<TableCell>
					{{ invite.editedAt ? dayjs(invite.editedAt).format('MMMM D, YYYY h:mm A') : 'N/A' }}
				</TableCell>
				<TableCell class="flex justify-end">
					<ConfirmationDialog
						title="Revoke link"
						message="This action will revoke the link preventing anyone from using it to create an account."
						:callback="() => cancelInvite(invite.code)"
					>
						<Button v-if="!invite.used" variant="destructive"> Revoke </Button>
					</ConfirmationDialog>
				</TableCell>
			</TableRow>
		</TableBody>
	</Table>
</template>

<script setup lang="ts">
import type { Invite } from '@/types';
import { cancelInvite } from '~/use/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog.vue';
import { Button } from '@/components/ui/button';

import dayjs from 'dayjs';

defineProps<{
	invites: Invite[];
}>();
</script>
