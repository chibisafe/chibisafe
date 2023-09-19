<template>
	<ScrollArea class="w-full">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<Breadcrumbs
				:pages="[
					{
						name: 'My account',
						href: '/dashboard/account'
					}
				]"
			/>
			<h1 class="text-2xl mt-8 font-semibold text-light-100">My account</h1>
			<div class="mt-8 bg-dark-110 p-8">
				<span class="text-light-100 block">Your current username. Can't be changed.</span>
				<InputWithLabel v-model="username" name="username" class="mt-4" label="Username" readOnly />

				<span class="mt-12 text-light-100 block"
					>If you want to change your password please enter your current one followed by the new password
					twice.</span
				>
				<InputWithLabel
					v-model="currentPassword"
					class="mt-4"
					label="Current password"
					type="password"
					name="currentPassword"
					:value="currentPassword"
				/>
				<InputWithLabel
					v-model="newPassword"
					class="mt-4"
					type="password"
					name="paassword"
					label="New password"
				/>
				<InputWithLabel
					v-model="reNewPassword"
					class="mt-4"
					type="password"
					name="repPassword"
					label="New password again"
				/>
				<Button class="mt-4" @click="doChangePassword">Change password</Button>
				<p v-if="error" class="text-red-400">{{ error }}</p>

				<span class="mt-12 text-light-100 block"
					>You can use the API key for 3rd-party services and scripts to gain access to your account.</span
				>
				<InputWithLabel v-model="apiKey" class="mt-4 mb-2" name="apiKey" label="API Key" blur readOnly />
				<ConfirmationDialog
					title="Request new API key"
					message="Requesting a new API key will invalidate the old one."
					:callback="doRequestApiKey"
				>
					<Button variant="destructive">Request new API key</Button>
				</ConfirmationDialog>

				<template v-if="userStore.user.storageQuota && showQuotaMessage">
					<span class="mt-12 text-light-100 block"> Your storage quota </span>
					<span class="text-light-100 block">
						Using {{ formatBytes(userStore.user.storageQuota.used) }} /
						{{ formatBytes(userStore.user.storageQuota.quota) }} ({{ getUsedStoragePercentage }}%)
					</span>
				</template>
			</div>
		</div>
	</ScrollArea>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { toast } from 'vue-sonner';
import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog.vue';
import InputWithLabel from '@/components/input/InputWithLabel.vue';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';
import { useUserStore } from '~/store/user';
import { changePassword, changeApiKey } from '~/use/api';
import { formatBytes } from '~/use/file';

const userStore = useUserStore();

const username = computed(() => userStore.user.username);
const currentPassword = ref('');
const newPassword = ref('');
const reNewPassword = ref('');
const error = ref('');
const apiKey = computed(() => userStore.user.apiKey);
const getUsedStoragePercentage = computed(() => {
	return ((userStore.user.storageQuota.used / userStore.user.storageQuota.quota) * 100).toFixed(2);
});
const showQuotaMessage = computed(() => {
	return userStore.user.storageQuota.quota !== 0;
});

const doChangePassword = async () => {
	error.value = '';
	if (currentPassword.value === '') {
		error.value = 'Current password is required';
		return;
	}

	if (newPassword.value === '') {
		error.value = 'New password is required';
		return;
	}

	if (reNewPassword.value === '') {
		error.value = 'New password again is required';
		return;
	}

	if (currentPassword.value === newPassword.value) {
		error.value = 'New password must be different from current password';
		return;
	}

	if (newPassword.value !== reNewPassword.value) {
		error.value = 'Passwords do not match';
		return;
	}

	const response = await changePassword(currentPassword.value, newPassword.value);
	if (!response) return;

	toast.success('Password changed successfully');

	error.value = '';
	// eslint-disable-next-line require-atomic-updates
	currentPassword.value = '';
	// eslint-disable-next-line require-atomic-updates
	newPassword.value = '';
	// eslint-disable-next-line require-atomic-updates
	reNewPassword.value = '';

	userStore.logout();
};

const doRequestApiKey = async () => {
	const response = await changeApiKey();
	if (!response) return;
	userStore.user.apiKey = response.apiKey;
};
</script>
