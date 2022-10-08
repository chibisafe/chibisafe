<template>
	<div class="flex w-full h-12 items-center mt-8">
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
				href="https://github.com/WeebDev/chibisafe"
				rel="noopener noreferrer"
				target="_blank"
				class="hover:text-blue-400"
				><IconGitHub class="w-8 h-8"
			/></a>
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
