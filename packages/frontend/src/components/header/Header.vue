<template>
	<div v-if="!isMobile" class="flex w-full h-12 items-center mt-8 max-w-4xl">
		<router-link to="/">
			<img v-if="settingsStore.logo" :src="settingsStore.logo" alt="chibisafe logo" class="w-12 mr-2" />
			<img v-else src="../../assets/images/logo.svg" alt="chibisafe logo" class="w-12 mr-2" />
		</router-link>
		<router-link to="/">
			<span class="font-bold text-3xl">{{ settingsStore.serviceName }}</span>
		</router-link>
		<span class="flex-1" />

		<router-link
			v-if="!loggedIn"
			to="/login"
			class="dark:text-light-100 dark:hover:text-blue-500 text-dark-100 hover:text-blue-500 text-lg"
			>Login / Register</router-link
		>

		<router-link
			v-else
			to="/dashboard/uploads"
			class="dark:text-light-100 dark:hover:text-blue-500 text-dark-100 hover:text-blue-500 text-lg"
			>Dashboard</router-link
		>

		<span class="ml-4">
			<a href="https://discord.gg/5g6vgwn" rel="noopener noreferrer" target="_blank" class="hover:text-blue-400"
				><IconDiscord class="w-8 h-8"
			/></a>
		</span>
		<span class="ml-4">
			<a
				href="https://github.com/chibisafe/chibisafe"
				rel="noopener noreferrer"
				target="_blank"
				class="hover:text-blue-400"
				><IconGitHub class="w-8 h-8"
			/></a>
		</span>
		<span class="ml-4">
			<a
				href="https://www.patreon.com/pitu"
				rel="noopener noreferrer"
				target="_blank"
				class="hover:text-blue-400"
			>
				<svg
					class="w-7 h-7"
					xmlns="http://www.w3.org/2000/svg"
					width="1em"
					height="1em"
					preserveAspectRatio="xMidYMid meet"
					viewBox="0 0 32 32"
				>
					<path
						fill="currentColor"
						d="M20.516.697c-6.355 0-11.521 5.167-11.521 11.521c0 6.333 5.167 11.484 11.521 11.484C26.849 23.702 32 18.551 32 12.218C32 5.863 26.849.697 20.516.697zM.005 31.38H5.63V.697H.005z"
					/>
				</svg>
			</a>
		</span>
	</div>

	<div v-else class="flex w-full h-auto items-center mt-8 max-w-4xl flex-col">
		<router-link to="/" class="flex items-center">
			<img v-if="settingsStore.logo" :src="settingsStore.logo" alt="chibisafe logo" class="w-12 mr-2" />
			<img v-else src="../../assets/images/logo.svg" alt="chibisafe logo" class="w-12 mr-2" />
			<span class="font-bold text-3xl">{{ settingsStore.serviceName }}</span>
		</router-link>

		<div class="flex items-center flex-col">
			<div class="flex items-center flex-row mt-4 mb-2">
				<span class="ml-4">
					<a
						href="https://discord.gg/5g6vgwn"
						rel="noopener noreferrer"
						target="_blank"
						class="hover:text-blue-400"
						><IconDiscord class="w-8 h-8"
					/></a>
				</span>
				<span class="ml-4">
					<a
						href="https://github.com/chibisafe/chibisafe"
						rel="noopener noreferrer"
						target="_blank"
						class="hover:text-blue-400"
						><IconGitHub class="w-8 h-8"
					/></a>
				</span>
				<span class="ml-4">
					<a
						href="https://www.patreon.com/pitu"
						rel="noopener noreferrer"
						target="_blank"
						class="hover:text-blue-400"
					>
						<svg
							class="w-7 h-7"
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
							preserveAspectRatio="xMidYMid meet"
							viewBox="0 0 32 32"
						>
							<path
								fill="currentColor"
								d="M20.516.697c-6.355 0-11.521 5.167-11.521 11.521c0 6.333 5.167 11.484 11.521 11.484C26.849 23.702 32 18.551 32 12.218C32 5.863 26.849.697 20.516.697zM.005 31.38H5.63V.697H.005z"
							/>
						</svg>
					</a>
				</span>
			</div>

			<router-link
				v-if="!loggedIn && !isAuthPage"
				to="/login"
				class="dark:text-light-100 dark:hover:text-blue-500 text-dark-100 hover:text-blue-500 text-xl p-4 mt-12"
				>Login / Register</router-link
			>

			<router-link
				v-else
				to="/dashboard/uploads"
				class="dark:text-light-100 dark:hover:text-blue-500 text-dark-100 hover:text-blue-500 text-xl p-4 mt-12"
				>Go to dashboard</router-link
			>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore, useSettingsStore } from '~/store';
import IconGitHub from '~icons/carbon/logo-github';
import IconDiscord from '~icons/carbon/logo-discord';
import { useWindowSize } from '@vueuse/core';

const userStore = useUserStore();
const settingsStore = useSettingsStore();
const route = useRoute();
const loggedIn = computed(() => userStore.user.loggedIn);
const isMobile = computed(() => useWindowSize().width.value < 640);
const isAuthPage = computed(() => route.path === '/login' || route.path === '/register');
</script>
