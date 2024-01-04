<template>
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead class="text-center">Username</TableHead>
				<TableHead class="text-center">Files</TableHead>
				<TableHead class="text-center">Status</TableHead>
				<TableHead class="text-center">Roles</TableHead>
				<TableHead class="text-center">Used</TableHead>
				<TableHead class="text-center">Limit</TableHead>
				<TableHead class="text-center">Created</TableHead>
				<TableHead class="text-right" />
			</TableRow>
		</TableHeader>
		<TableBody>
			<TableRow v-for="user in data" :key="user.uuid">
				<TableCell>
					{{ user.username }}
				</TableCell>
				<TableCell>
					{{ user._count.files }}
				</TableCell>
				<TableCell>
					{{ user.enabled ? 'Enabled' : 'Disabled' }}
				</TableCell>
				<TableCell>
					<div class="flex gap-2 items-center justify-center">
						<Badge v-for="role in user.roles" :key="role.name">{{ role.name }}</Badge>
					</div>
				</TableCell>
				<TableCell>
					{{ formatBytes(user.storageQuota.used) }}
				</TableCell>
				<TableCell>
					{{ user.storageQuota.quota ? formatBytes(user.storageQuota.quota) : 'Unlimited' }}
				</TableCell>
				<TableCell>
					<Tooltip :text="dayjs(user.createdAt).format('MMMM D, YYYY h:mm A')">{{
						dayjs().to(user.createdAt)
					}}</Tooltip>
				</TableCell>
				<TableCell class="flex gap-2 justify-end">
					<Button as="router-link" :to="`/dashboard/admin/user/${user.uuid}`">Files</Button>

					<InputQuotaDialog
						title="Set quota"
						message="This action will set the user's quota to the specified value. The user won't be able to use more space than the quota allows."
						label="Quota in bytes"
						proceedText="Confirm"
						:callback="quota => setUserStorageQuota(user.uuid, Number(quota))"
					>
						<Button variant="secondary">Quota</Button>
					</InputQuotaDialog>
					<ConfirmationDialog
						v-if="user.enabled && user.uuid !== ownUser.uuid"
						title="Disable user"
						message="This action will disable the user and thus prevent them from logging into chibisafe again until you enable them once more. All uploaded files and albums will remain intact."
						:callback="() => disableUser(user.uuid)"
					>
						<Button variant="secondary">Disable</Button>
					</ConfirmationDialog>
					<ConfirmationDialog
						v-if="!user.enabled && user.uuid !== ownUser.uuid"
						title="Enable user"
						message="This action will enable the user and allow them to log into chibisafe again. They'll be able to access all previous uploads and albums."
						:callback="() => enableUser(user.uuid)"
					>
						<Button variant="secondary">Enable</Button>
					</ConfirmationDialog>
					<ConfirmationDialog
						v-if="isUserAdmin(user) && user.uuid !== ownUser.uuid"
						title="Demote user"
						message="This action will remove the admin role and demote the user back to a normal user."
						:callback="() => demoteUser(user.uuid)"
					>
						<Button variant="secondary">Demote</Button>
					</ConfirmationDialog>
					<ConfirmationDialog
						v-if="!isUserAdmin(user) && user.uuid !== ownUser.uuid"
						title="Promote user"
						message="This action will promote the user to admin. They'll be able to do everything you can do. Be careful before promoting anyone to understand the risks."
						:callback="() => promoteUser(user.uuid)"
					>
						<Button variant="secondary">Promote</Button>
					</ConfirmationDialog>
					<ConfirmationDialog
						title="Purge user"
						message="This action will delete ALL files, albums, tags and snippets created by the user. This action is not reversible."
						:callback="() => purgeUser(user.uuid)"
					>
						<Button variant="destructive">Purge</Button>
					</ConfirmationDialog>
				</TableCell>
			</TableRow>
		</TableBody>
	</Table>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { computed } from 'vue';
import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog.vue';
import InputQuotaDialog from '@/components/dialogs/InputQuotaDialog.vue';
import Tooltip from '@/components/tooltip/Tooltip.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { UserWithCount } from '@/types';
import { useUserStore } from '~/store';
import { enableUser, disableUser, purgeUser, promoteUser, demoteUser, setUserStorageQuota } from '~/use/api';
import { formatBytes } from '~/use/file';

defineProps<{
	data: UserWithCount[];
}>();

dayjs.extend(relativeTime);
const userStore = useUserStore();
const ownUser = computed(() => userStore.user);
const isUserAdmin = (user: UserWithCount) => user.roles.some(role => role.name === 'admin');
</script>
