<template>
	<div class="flex w-full h-auto items-center mt-8 max-w-4xl mobile:flex-col">
		<router-link to="/" class="mobile:items-center flex">
			<img v-if="settingsStore.logoURL" :src="settingsStore.logoURL" alt="chibisafe logo" class="w-12 mr-2" />
			<img v-else src="/logo.svg" alt="chibisafe logo" class="w-12 mr-2" />
			<span class="font-bold text-3xl place-self-center">{{ settingsStore.serviceName }}</span>
		</router-link>
		<span class="flex-1" />

		<div
			class="flex space-x-4 items-center justify-center mobile:flex-col-reverse mobile:space-x-0 mobile:space-y-4"
		>
			<router-link v-if="!loggedIn" to="/login" class="text-light-100 hover:text-blue-500 text-lg mobile:text-2xl"
				>Login / Register</router-link
			>

			<router-link
				v-else
				to="/dashboard/uploads"
				class="text-light-100 hover:text-blue-500 text-lg mobile:text-2xl"
				>Dashboard</router-link
			>
			<a
				href="/docs"
				target="_blank"
				rel="noreferrer noopener"
				class="text-light-100 hover:text-blue-500 text-lg mobile:text-2xl"
				>Docs</a
			>

			<div class="flex space-x-4">
				<span>
					<a
						href="https://discord.gg/5g6vgwn"
						rel="noopener noreferrer"
						target="_blank"
						class="hover:text-blue-400"
					>
						<svg
							class="w-8 h-8"
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							viewBox="0 0 32 32"
						>
							<path
								fill="currentColor"
								d="M25.7 7.1C23.9 6.3 22 5.7 20 5.3h-.1c-.2.4-.5 1-.7 1.5c-2.2-.3-4.3-.3-6.4 0c-.2-.5-.5-1-.7-1.5H12c-2 .3-3.9.9-5.7 1.8C2.7 12.5 1.7 17.8 2.2 23v.1c2.4 1.8 4.7 2.8 7 3.5h.1c.5-.7 1-1.5 1.4-2.3v-.1c-.8-.3-1.5-.6-2.2-1c-.1 0-.1-.1 0-.1c.1-.1.3-.2.4-.3H9c4.6 2.1 9.5 2.1 14.1 0h.1c.1.1.3.2.4.3c.1 0 0 .1 0 .1c-.7.4-1.4.8-2.2 1c0 0-.1.1 0 .1c.4.8.9 1.6 1.4 2.3h.1c2.3-.7 4.6-1.8 7-3.5V23c.6-6-1-11.2-4.2-15.9zM11.4 19.9c-1.4 0-2.5-1.3-2.5-2.8s1.1-2.8 2.5-2.8s2.5 1.3 2.5 2.8c0 1.5-1.1 2.8-2.5 2.8zm9.3 0c-1.4 0-2.5-1.3-2.5-2.8s1.1-2.8 2.5-2.8s2.5 1.3 2.5 2.8c0 1.5-1.1 2.8-2.5 2.8z"
							/>
						</svg>
					</a>
				</span>
				<span>
					<a
						href="https://github.com/chibisafe/chibisafe"
						rel="noopener noreferrer"
						target="_blank"
						class="hover:text-blue-400"
					>
						<svg
							class="w-8 h-8"
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							viewBox="0 0 32 32"
						>
							<path
								fill="currentColor"
								fill-rule="evenodd"
								d="M16 2a14 14 0 0 0-4.43 27.28c.7.13 1-.3 1-.67v-2.38c-3.89.84-4.71-1.88-4.71-1.88a3.71 3.71 0 0 0-1.62-2.05c-1.27-.86.1-.85.1-.85a2.94 2.94 0 0 1 2.14 1.45a3 3 0 0 0 4.08 1.16a2.93 2.93 0 0 1 .88-1.87c-3.1-.36-6.37-1.56-6.37-6.92a5.4 5.4 0 0 1 1.44-3.76a5 5 0 0 1 .14-3.7s1.17-.38 3.85 1.43a13.3 13.3 0 0 1 7 0c2.67-1.81 3.84-1.43 3.84-1.43a5 5 0 0 1 .14 3.7a5.4 5.4 0 0 1 1.44 3.76c0 5.38-3.27 6.56-6.39 6.91a3.33 3.33 0 0 1 .95 2.59v3.84c0 .46.25.81 1 .67A14 14 0 0 0 16 2Z"
							/>
						</svg>
					</a>
				</span>
				<span>
					<a
						href="https://www.patreon.com/pitu"
						rel="noopener noreferrer"
						target="_blank"
						class="hover:text-blue-400"
					>
						<svg
							class="w-7 h-8"
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
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
		</div>
	</div>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';
import { ref, computed, onMounted } from 'vue';
import { useUserStore, useSettingsStore } from '~/store';

const userStore = useUserStore();
const settingsStore = useSettingsStore();
const loggedIn = computed(() => userStore.user.loggedIn);
const isMobile = ref(false);

onMounted(() => {
	isMobile.value = useWindowSize().width.value < 640;
});
</script>
