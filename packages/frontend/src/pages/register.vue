<template>
	<div
		class="container relative h-screen flex-col items-center justify-center grid max-w-none grid-cols-2 px-0 bg-dark-110 mobile:flex"
	>
		<router-link
			to="/login"
			class="text-blue-500"
			:class="cn(buttonVariants({ variant: 'ghost' }), 'absolute mobile:right-4 mobile:top-4 right-8 top-8')"
		>
			Log in
		</router-link>
		<div class="relative mobile:hidden h-full flex-col bg-muted p-10 text-white border-background border-r flex">
			<div
				class="absolute inset-0 bg-no-repeat bg-scroll bg-center bg-cover"
				:style="`background-image: url(${settingsStore.backgroundImageURL});`"
			/>
			<div class="relative z-20 flex items-center text-lg font-medium">
				<router-link to="/">
					<img
						v-if="settingsStore.logoURL"
						:src="settingsStore.logoURL"
						alt="chibisafe logo"
						class="w-12 mr-2"
					/>
					<img v-else src="/logo.svg" alt="chibisafe logo" class="w-12 mr-2" />
				</router-link>
				<router-link to="/">
					<span class="font-bold text-3xl">{{ settingsStore.serviceName }}</span>
				</router-link>
			</div>
			<div class="relative z-20 mt-auto">
				<blockquote class="space-y-2">
					<p class="text-lg">
						<strong>chibisafe</strong> simplifies file management with features like upload tracking, album
						creation, and easy downloads. You can tag and preview files, customize access with unique links,
						and much more.
					</p>
				</blockquote>
			</div>
		</div>
		<div class="p-8 relative">
			<div
				v-if="!settingsStore.userAccounts"
				class="p-4 text-center mt-8 desktop:mx-auto desktop:w-full desktop:max-w-md self-center"
			>
				This instance is currently running in invite-only mode, therefore you can't register an account at this
				time.
			</div>
			<div v-else class="mx-auto flex mobile:w-full flex-col justify-center space-y-6 w-[350px]">
				<div class="flex flex-col space-y-2 text-center">
					<h1 class="text-2xl font-semibold tracking-tight">Registration</h1>
					<p class="text-sm text-muted-foreground">Use the form below to create your account</p>
				</div>
				<div class="grid gap-2">
					<div class="grid gap-1">
						<Label class="sr-only" for="username"> Username </Label>
						<Input
							id="username"
							v-model="username"
							placeholder="Username"
							type="text"
							auto-capitalize="none"
							auto-complete="username"
							auto-correct="off"
							:disabled="isLoading"
						/>
					</div>

					<div class="grid gap-1">
						<Label class="sr-only" for="password"> Password </Label>
						<Input
							id="password"
							v-model="password"
							placeholder="Password"
							type="password"
							auto-capitalize="none"
							auto-complete="password"
							auto-correct="off"
							:disabled="isLoading"
						/>
					</div>

					<div class="grid gap-1">
						<Label class="sr-only" for="repassword"> Re-password </Label>
						<Input
							id="repassword"
							v-model="repassword"
							placeholder="Password again"
							type="password"
							auto-capitalize="none"
							auto-complete="repassword"
							auto-correct="off"
							:disabled="isLoading"
							@keyup.enter="register"
						/>
					</div>
					<Button :disabled="isLoading" @click="register">
						<Loader2Icon v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
						Create account
					</Button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Loader2Icon } from 'lucide-vue-next';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '~/store';
import { register as Register } from '~/use/api';

const router = useRouter();
const settingsStore = useSettingsStore();

// Form models
const username = ref('');
const password = ref('');
const repassword = ref('');

const isLoading = ref(false);

const register = async () => {
	if (!settingsStore.userAccounts) return;
	if (!username.value || !password.value || !repassword.value) {
		toast.error('Username or any of the two passwords are missing');
		return;
	}

	if (password.value !== repassword.value) {
		toast.error('The passwords need to be the same on both fields');
		return;
	}

	isLoading.value = true;
	const response = await Register(username.value, password.value);
	isLoading.value = false;
	if (!response) return;

	toast.success('Successfully registered! You can now login.');
	// eslint-disable-next-line require-atomic-updates
	password.value = '';
	// eslint-disable-next-line require-atomic-updates
	repassword.value = '';

	// TODO: Redirect to login page
	await router.push('/login');
};
</script>
