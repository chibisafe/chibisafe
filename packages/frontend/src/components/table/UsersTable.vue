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
					<Badge v-for="role in user.roles" :key="role.name" class="mr-2">{{ role.name }}</Badge>
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

					<Button @click="() => {}">Quota</Button>
					<ConfirmationDialog
						v-if="user.enabled && user.uuid !== ownUser.uuid"
						title="Disable user"
						message="This action will disable the user and thus prevent them from logging into chibisafe again until you enable them once more. All uploaded files and albums will remain intact."
						:callback="() => disableUser(user.uuid)"
						variant="secondary"
					>
						Disable
					</ConfirmationDialog>
					<ConfirmationDialog
						v-if="!user.enabled && user.uuid !== ownUser.uuid"
						title="Enable user"
						message="This action will enable the user and allow them to log into chibisafe again. They'll be able to access all previous uploads and albums."
						:callback="() => enableUser(user.uuid)"
						variant="secondary"
					>
						Enable
					</ConfirmationDialog>
					<ConfirmationDialog
						v-if="isUserAdmin(user) && user.uuid !== ownUser.uuid"
						title="Demote user"
						message="This action will remove the admin role and demote the user back to a normal user."
						:callback="() => demoteUser(user.uuid)"
						variant="secondary"
					>
						Demote
					</ConfirmationDialog>
					<ConfirmationDialog
						v-if="!isUserAdmin(user) && user.uuid !== ownUser.uuid"
						title="Promote user"
						message="This action will promote the user to admin. They'll be able to do everything you can do. Be careful before promoting anyone to understand the risks."
						:callback="() => promoteUser(user.uuid)"
						variant="secondary"
					>
						Promote
					</ConfirmationDialog>
					<ConfirmationDialog
						title="Purge user"
						message="This action will delete ALL files and albums uploaded by the user. This action is not reversible."
						:callback="() => purgeUser(user.uuid)"
						variant="destructive"
					>
						Purge
					</ConfirmationDialog>
				</TableCell>
			</TableRow>
		</TableBody>
	</Table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '~/store';
import { enableUser, disableUser, purgeUser, promoteUser, demoteUser } from '~/use/api';
import { formatBytes } from '~/use/file';
import type { UserWithCount } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog.vue';
import Tooltip from '@/components/tooltip/Tooltip.vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

defineProps<{
	data: UserWithCount[];
}>();

dayjs.extend(relativeTime);
const userStore = useUserStore();
const ownUser = computed(() => userStore.user);
const isUserAdmin = (user: UserWithCount) => user.roles.some(role => role.name === 'admin');
</script>
