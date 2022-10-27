<template>
	<div class="h-screen w-full overflow-auto">
		<div class="flex flex-col items-center w-full self-center dark:text-light-100">
			<Header />
		</div>
		<div
			class="flex flex-col items-center h-auto min-h-[900px] w-full dark:text-light-100 justify-center self-center"
		>
			<div class="flex w-full mt-16 items-center relative max-w-4xl flex-col">
				<h3 class="font-bold text-2xl dark:text-light-100 text-dark-100">You've received an invite!</h3>
				<p class="mt-4 text-center">
					Someone sent you an invite to create an account on this chibisafe instance. In order to continue
					please create a username and password below.
				</p>

				<div class="mt-4">
					<Input v-model="username" label="Username" />
					<Input v-model="password" label="Password" type="password" class="mt-4" />
					<Input
						v-model="repassword"
						label="Password again"
						type="password"
						class="mt-4"
						@keyup.prevent.enter="register"
					/>
					<div class="mt-4 justify-end flex gap-1">
						<Button @click="register">Register</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { register as Register } from '~/use/api';
import { useRouter } from 'vue-router';
import { useToastStore } from '~/store/toast';
import Button from '~/components/buttons/Button.vue';
import Input from '~/components/forms/Input.vue';

const props = defineProps<{
	code: string;
}>();

const router = useRouter();
const toastStore = useToastStore();

// Form models
const username = ref('');
const password = ref('');
const repassword = ref('');

const register = async () => {
	if (!username.value || !password.value || !repassword.value) {
		toastStore.create('error', 'Username or any of the two passwords are missing');
		return;
	}

	if (password.value !== repassword.value) {
		toastStore.create('error', 'The passwords need to be the same on both fields');
		return;
	}

	const response = await Register(username.value, password.value, props.code);
	if (!response) return;

	toastStore.create('success', 'Successfully registered! You can now login.');
	// eslint-disable-next-line require-atomic-updates
	password.value = '';
	// eslint-disable-next-line require-atomic-updates
	repassword.value = '';

	// TODO: Redirect to login page
};
</script>
