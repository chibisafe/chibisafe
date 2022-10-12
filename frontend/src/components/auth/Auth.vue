<template>
	<Menu v-if="loggedIn" as="div" class="relative">
		<MenuButton
			class="h-12 flex justify-center items-center text-right bg-transparent hover:bg-transparent text-chibisafe-text-light hover:text-white border-transparent p-0"
		>
			<span class="mx-0 text-md text-right">Welcome back, {{ loggedInUsername }}</span>
		</MenuButton>

		<transition
			enter-active-class="transition duration-100 ease-out"
			enter-from-class="transform scale-95 opacity-0"
			enter-to-class="transform scale-100 opacity-100"
			leave-active-class="transition duration-75 ease-in"
			leave-from-class="transform scale-100 opacity-100"
			leave-to-class="transform scale-95 opacity-0"
		>
			<MenuItems
				class="absolute right-0 w-48 mt-2 origin-top-right bg-white dark:bg-white divide-y divide-chibisafe rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
			>
				<div class="px-1 py-1">
					<MenuItem v-slot="{ active }">
						<Button
							variant="none"
							align="left"
							class="group flex rounded-md items-center w-full px-2 py-2 text-sm dark:text-chibisafe-text-dark text-chibisafe-dark"
							:class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700']"
							@click="router.push('/dashboard')"
						>
							Uploads
						</Button>
					</MenuItem>
					<MenuItem v-slot="{ active }">
						<Button
							variant="none"
							align="left"
							class="group flex rounded-md items-center w-full px-2 py-2 text-sm dark:text-chibisafe-text-dark text-chibisafe-dark"
							:class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700']"
							@click="router.push('/dashboard/albums')"
						>
							Albums
						</Button>
					</MenuItem>
					<MenuItem v-slot="{ active }">
						<Button
							variant="none"
							align="left"
							class="group flex rounded-md items-center w-full px-2 py-2 text-sm dark:text-chibisafe-text-dark text-chibisafe-dark"
							:class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700']"
							@click="router.push('/dashboard/account')"
						>
							Account
						</Button>
					</MenuItem>
				</div>
				<div class="px-1 py-1">
					<MenuItem v-slot="{ active }">
						<Button
							variant="none"
							align="left"
							class="group flex rounded-md items-center w-full px-2 py-2 text-sm dark:text-chibisafe-text-dark text-chibisafe-dark"
							:class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700']"
							@click="userStore.logout()"
						>
							Logout
						</Button>
					</MenuItem>
				</div>
			</MenuItems>
		</transition>
	</Menu>

	<Button v-else type="button" variant="link" size="lg" @click="openLoginModal"> Log in / Register </Button>

	<TransitionRoot appear :show="isLoginModalOpen" as="template">
		<Dialog as="div" @close="closeLoginModal">
			<DialogOverlay class="fixed inset-0 bg-black opacity-50" />
			<div class="fixed inset-0 z-10 overflow-y-auto">
				<div class="min-h-screen px-4 text-center">
					<TransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0"
						enter-to="opacity-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100"
						leave-to="opacity-0"
					>
						<DialogOverlay class="fixed inset-0" />
					</TransitionChild>

					<span class="inline-block h-screen align-middle" aria-hidden="true"> &#8203; </span>

					<TransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95"
					>
						<div
							class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-white shadow-xl rounded-md"
						>
							<DialogTitle
								as="h3"
								class="text-2xl text-center font-extrabold leading-6 dark:text-chibisafe-text-dark text-chibisafe-dark"
							>
								Authentication
							</DialogTitle>
							<template v-if="isLogin">
								<div class="mt-2">
									<p class="text-md dark:text-chibisafe-text-dark text-chibisafe-dark text-center">
										If you don't have an account yet please
										<Button variant="none" class="text-blue-500" @click="isLogin = !isLogin"
											>click here</Button
										>
									</p>
								</div>

								<div class="mt-4">
									<Input v-model="username" label="Username" />
									<Input
										v-model="password"
										label="Password"
										type="password"
										class="mt-4"
										@keyup.prevent.enter="login"
									/>
									<div class="mt-4 justify-end flex gap-1">
										<Button variant="none" class="px-4 py-2" @click="closeLoginModal"
											>Cancel</Button
										>
										<Button @click="login">Login</Button>
									</div>
								</div>
							</template>
							<template v-else>
								<div class="mt-2">
									<p class="text-md dark:text-chibisafe-text-dark text-chibisafe-dark text-center">
										If you have an account and want to log in instead then
										<Button variant="none" class="text-blue-500" @click="isLogin = !isLogin"
											>click here</Button
										>
									</p>
								</div>

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
										<Button variant="none" class="px-4 py-2" @click="closeLoginModal"
											>Cancel</Button
										>
										<Button @click="register">Register</Button>
									</div>
								</div>
							</template>
						</div>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
	TransitionRoot,
	TransitionChild,
	Dialog,
	DialogOverlay,
	DialogTitle,
	Menu,
	MenuButton,
	MenuItems,
	MenuItem
} from '@headlessui/vue';
import { useUserStore } from '~/store/user';

import Button from '~/components/buttons/Button.vue';
import Input from '~/components/forms/Input.vue';

const router = useRouter();
const userStore = useUserStore();

// Form models
const isLogin = ref(true);
const username = ref('');
const password = ref('');
const repassword = ref('');
const isLoginModalOpen = ref(false);

// Computed properties
const loggedIn = computed(() => userStore.loggedIn);
const loggedInUsername = computed(() => userStore.username);
const isAdmin = computed(() => userStore.isAdmin);

const closeLoginModal = () => {
	username.value = '';
	password.value = '';
	repassword.value = '';
	isLogin.value = true;
	isLoginModalOpen.value = false;
};

const openLoginModal = () => {
	isLoginModalOpen.value = true;
};

const login = async () => {
	// TODO: Handle errors and empty inputs
	if (!username.value || !password.value) return;
	await userStore.login(username.value, password.value);
	if (loggedIn.value) closeLoginModal();
};

const register = async () => {
	// TODO: Handle errors and empty inputs
	if (!username.value || !password.value || !repassword.value) return;
	if (password.value !== repassword.value) return;

	await userStore.register(username.value, password.value);
	// eslint-disable-next-line require-atomic-updates
	password.value = '';
	// eslint-disable-next-line require-atomic-updates
	repassword.value = '';

	isLogin.value = true;
};
</script>
