<template>
	<div class="h-screen w-full overflow-auto">
		<div class="flex flex-col items-center w-full self-center dark:text-light-100">
			<Header />
		</div>
		<div
			class="flex flex-col items-center h-auto min-h-[900px] w-full dark:text-light-100 justify-center self-center"
		>
			<div class="flex w-full mt-16 items-center relative max-w-4xl flex-col">
				<div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 w-full">
					<div class="sm:mx-auto sm:w-full sm:max-w-md">
						<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-light-100">
							You've received an invite!
						</h2>
						<p class="mt-4 text-center">
							Someone sent you an invite to create an account on this chibisafe instance. In order to
							continue please create a username and password below.
						</p>
					</div>

					<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
						<div class="bg-white dark:bg-dark-110 py-8 px-4 shadow sm:rounded-lg sm:px-10">
							<form class="space-y-6" action="#" method="POST">
								<div>
									<label
										for="email"
										class="block text-sm font-medium text-gray-700 dark:text-light-100"
										>Username</label
									>
									<div class="mt-1">
										<Input v-model="username" type="text" />
									</div>
								</div>

								<div>
									<label
										for="password"
										class="block text-sm font-medium text-gray-700 dark:text-light-100"
										>Password</label
									>
									<div class="mt-1">
										<Input v-model="password" type="password" />
									</div>
								</div>

								<div>
									<label
										for="password"
										class="block text-sm font-medium text-gray-700 dark:text-light-100"
										>Re-type password</label
									>
									<div class="mt-1">
										<Input v-model="repassword" type="password" />
									</div>
								</div>

								<div class="mt-4 justify-end flex gap-1">
									<Button variant="link" @click="register"> Create account </Button>
								</div>
							</form>
						</div>
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

	await router.push('/login');
};
</script>
