<template>
	<Sidebar>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-screen overflow-auto">
			<h1 class="text-2xl mt-8 font-semibold text-light-100">My account</h1>
			<div class="mt-8 max-w-md">
				<InputWithOverlappingLabel v-model="username" class="mt-4" label="Username" readOnly />
				<InputWithOverlappingLabel
					v-model="currentPassword"
					class="mt-12"
					label="Current password"
					type="password"
					:value="currentPassword"
				/>
				<InputWithOverlappingLabel v-model="newPassword" class="mt-4" type="password" label="New password" />
				<InputWithOverlappingLabel
					v-model="reNewPassword"
					class="mt-4"
					type="password"
					label="New password again"
				/>
				<Button class="mt-4" @click="doChangePassword">Change password</Button>
				<p v-if="error" class="text-red-400">{{ error }}</p>

				<InputWithOverlappingLabel v-model="apiKey" class="mt-16" label="API Key" readOnly />
				<Button class="mt-4" @click="doRequestApiKey">Request new API key</Button>
			</div>
		</div>
	</Sidebar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '~/store/user';
import { useToastStore } from '~/store/toast';
import { changePassword, changeApiKey } from '~/use/api';

import Sidebar from '~/components/sidebar/Sidebar.vue';
import InputWithOverlappingLabel from '~/components/forms/InputWithOverlappingLabel.vue';
import Button from '~/components/buttons/Button.vue';

const userStore = useUserStore();
const toastStore = useToastStore();

const username = computed(() => userStore.username);
const currentPassword = ref('');
const newPassword = ref('');
const reNewPassword = ref('');
const error = ref('');
const apiKey = computed(() => userStore.apiKey);

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

	console.log('good stuff');

	const response = await changePassword(currentPassword.value, newPassword.value);
	if (!response) return;

	toastStore.create('success', 'Password changed successfully');

	error.value = '';
	// eslint-disable-next-line require-atomic-updates
	currentPassword.value = '';
	// eslint-disable-next-line require-atomic-updates
	newPassword.value = '';
	// eslint-disable-next-line require-atomic-updates
	reNewPassword.value = '';
};

const doRequestApiKey = async () => {
	const response = await changeApiKey();
	if (!response) return;
	userStore.apiKey = response.apiKey;
};
</script>
