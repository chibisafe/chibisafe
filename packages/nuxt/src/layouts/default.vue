<template>
	<div class="flex flex-col items-center w-full self-center">
		<div class="flex w-full flex-col max-w-4xl">
			<div class="flex w-full h-12 my-8 items-center">
				<router-link to="/">
					<img src="/logo.svg" alt="chibisafe logo" class="w-12 mr-2" />
				</router-link>
				<router-link to="/">
					<span class="font-bold text-3xl">chibisafe</span>
				</router-link>

				<span class="flex-1" />

				<router-link to="/ark">
					<span>Components</span>
				</router-link>

				<a class="ml-4" href="/_tailwind/" target="_blank">Tailwind</a>

				<a class="ml-4" href="https://icones.js.org/collection/lucide" target="_blank" rel="noopener noreferrer"
					>Icons</a
				>

				<button type="button" class="ml-4" @click="toggleTheme">
					<SunDimIcon v-if="colorMode.value === 'dark'" class="w-6 h-6" />
					<MoonIcon v-else class="w-6 h-6" />
				</button>
			</div>
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
import { SunDimIcon, MoonIcon } from 'lucide-vue-next';
import { computed } from 'vue';

const loggedIn = computed(() => false);
const colorMode = useColorMode();

const toggleTheme = () => {
	if (colorMode.value === 'dark') {
		colorMode.value = 'light';
	} else {
		colorMode.value = 'dark';
	}
};
</script>
