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
							Authentication
						</h2>
						<p class="mt-4 text-center">
							If you don't have an account yet please
							<router-link to="/register" class="text-blue-500">click here</router-link>
						</p>
					</div>

					<div class="mt-8 desktop:mx-auto desktop:w-full desktop:max-w-md">
						<div class="bg-white dark:bg-dark-110 py-8 px-4 shadow desktop:rounded-lg desktop:px-10">
							<form class="space-y-6" action="#" method="POST">
								<div>
									<label class="block text-sm font-medium text-gray-700 dark:text-light-100"
										>Username</label
									>
									<div class="mt-1">
										<Input v-model="username" type="email" autocomplete="username" />
									</div>
								</div>

								<div>
									<label class="block text-sm font-medium text-gray-700 dark:text-light-100"
										>Password</label
									>
									<div class="mt-1">
										<Input
											v-model="password"
											type="password"
											autocomplete="current-password"
											@keyup.enter="login"
										/>
									</div>
								</div>

								<div class="mt-4 justify-end flex gap-1">
									<Button variant="link" @click="login">Login</Button>
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToastStore } from '~/store/toast';
import { useUserStore } from '~/store/user';
import Button from '~/components/buttons/Button.vue';
import Input from '~/components/forms/Input.vue';

const router = useRouter();
const toastStore = useToastStore();
const userStore = useUserStore();

// Form models
const username = ref('');
const password = ref('');

const loggedIn = computed(() => userStore.user.loggedIn);

const login = async () => {
	if (!username.value || !password.value) {
		toastStore.create('error', 'Username or password are missing');
		return;
	}

	await userStore.login(username.value, password.value);
	if (loggedIn.value) await router.push('/dashboard/uploads');
};
</script>
