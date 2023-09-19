<template>
	<div
		class="container relative h-screen flex-col items-center justify-center grid max-w-none grid-cols-2 px-0 bg-dark-110 mobile:flex"
	>
		<router-link
			to="/register"
			class="text-blue-500"
			:class="cn(buttonVariants({ variant: 'ghost' }), 'absolute mobile:right-4 mobile:top-4 right-8 top-8')"
		>
			Open an account
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
						<strong>chibisafe</strong> is a modern and self-hosted take on file uploading services that can
						handle anything you throw at it thanks to it's robust and fast API, chunked uploads support and
						more.
					</p>
				</blockquote>
			</div>
		</div>
		<div class="p-8 relative">
			<div class="mx-auto flex mobile:w-full flex-col justify-center space-y-6 w-[350px]">
				<div class="flex flex-col space-y-2 text-center">
					<h1 class="text-2xl font-semibold tracking-tight">Authentication</h1>
					<p class="text-sm text-muted-foreground">Enter your credentials below to log in</p>
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
							@keyup.enter="login"
						/>
					</div>
					<Button :disabled="isLoading" @click="login">
						<Loader2Icon v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
						Sign In
					</Button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Loader2Icon } from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useUserStore, useSettingsStore } from '~/store';

const router = useRouter();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const isLoading = ref(false);

// Form models
const username = ref('');
const password = ref('');

const loggedIn = computed(() => userStore.user.loggedIn);

const login = async () => {
	if (!username.value || !password.value) {
		toast.error('Username or password are missing');
		return;
	}

	isLoading.value = true;
	await userStore.login(username.value, password.value);
	isLoading.value = false;
	if (loggedIn.value) await router.push('/dashboard/uploads');
};
</script>
