<template>
	<div class="flex w-full h-12 items-center mt-8 max-w-4xl">
		<router-link to="/">
			<img src="../../assets/images/logo.png" alt="chibisafe logo" class="w-12 mr-2" />
		</router-link>
		<router-link to="/">
			<span class="font-bold text-3xl">chibisafe</span>
		</router-link>
		<span class="flex-1" />
		<Auth />

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
			<a href="https://www.patreon.com/pitu" rel="noopener noreferrer" target="_blank" class="hover:text-blue-400"
				><svg
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
</template>

<script setup lang="ts">
import Auth from '../auth/Auth.vue';
// @ts-ignore
import IconGitHub from '~icons/carbon/logo-github';
// @ts-ignore
import IconDiscord from '~icons/carbon/logo-discord';
</script>
