<template>
	<div class="h-screen w-full overflow-auto">
		<div class="flex flex-col items-center w-full self-center dark:text-light-100">
			<Header />
		</div>
		<div
			class="flex flex-col items-center h-auto min-h-[900px] mobile:min-h-0 w-full dark:text-light-100 justify-center self-center"
		>
			<div class="flex w-full mt-16 mobile:mt-0 items-center relative max-w-4xl flex-col">
				<div class="flex min-h-full flex-col justify-center py-12 mobile:py-0 desktop:px-6 lg:px-8 w-full">
					<div class="desktop:mx-auto desktop:w-full desktop:max-w-md">
						<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-light-100">
							Create an account
						</h2>
						<p class="mt-4 text-center">
							If you already have one and want to log in instead
							<router-link to="/login" class="text-blue-500">click here</router-link>
						</p>
					</div>

					<div class="mt-8 desktop:mx-auto desktop:w-full desktop:max-w-md">
						<div class="bg-white dark:bg-dark-110 py-8 px-4 shadow desktop:rounded-lg desktop:px-10">
							<form class="space-y-6" action="#" method="POST">
								<div>
									<label
										for="email"
										class="block text-sm font-medium text-gray-700 dark:text-light-100"
										>Username</label
									>
									<div class="mt-1">
										<Input v-model="username" type="email" autocomplete="username" />
									</div>
								</div>

								<div>
									<label
										for="password"
										class="block text-sm font-medium text-gray-700 dark:text-light-100"
										>Password</label
									>
									<div class="mt-1">
										<Input v-model="password" type="password" autocomplete="current-password" />
									</div>
								</div>

								<div>
									<label
										for="password"
										class="block text-sm font-medium text-gray-700 dark:text-light-100"
										>Re-type password</label
									>
									<div class="mt-1">
										<Input
											v-model="repassword"
											type="password"
											autocomplete="current-password"
											@keyup.enter="register"
										/>
									</div>
								</div>

								<div class="mt-4 justify-end flex gap-1">
									<Button variant="link" @click="register"> Create account </Button>
								</div>
							</form>
						</div>
					</div>

					<div class="p-4">
						<h2 class="mt-6 text-center text-2xl font-bold tracking-tight text-light-100">
							Some benefits of having an account
						</h2>
						<p class="mt-4 text-center">
							With an account you can track your uploads, create and share albums, zip entire collections
							to download. You can also tag your uploads, see previews and detailed information about your
							files, give access to people to only the files you want them to access with customized
							links, and more!
						</p>
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

	const response = await Register(username.value, password.value);
	if (!response) return;

	toastStore.create('success', 'Successfully registered! You can now login.');
	// eslint-disable-next-line require-atomic-updates
	password.value = '';
	// eslint-disable-next-line require-atomic-updates
	repassword.value = '';

	// TODO: Redirect to login page
	await router.push('/login');
};
</script>
