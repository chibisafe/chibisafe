<template>
	<div
		class="flex gap-2 items-center"
		:class="[inverted ? 'flex-row-reverse justify-end' : 'flex-row justify-start']"
	>
		<label
			v-if="$slots.default"
			class="text-theme-1000 dark:text-theme-100 text-[15px] leading-none select-none"
			:for="id"
		>
			<slot />
		</label>
		<SwitchRoot
			:id="id"
			v-model:checked="switchState"
			class="w-[42px] h-[25px] flex bg-black/50 dark:bg-theme-400 shadow-sm rounded-full relative data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-500 cursor-pointer focus:shadow-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-offset-1 outline-none"
			@update:checked="onChange"
		>
			<SwitchThumb
				class="block w-[21px] h-[21px] my-auto bg-white shadow-sm rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]"
			/>
		</SwitchRoot>
	</div>
</template>

<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'radix-vue';
import { ref } from 'vue';

interface Props {
	disabled?: boolean;
	inverted?: boolean;
}

defineProps<Props>();

const emit = defineEmits(['change']);

const switchState = ref(false);
const id = ref(`switch-${String(Math.random()).slice(2)}`);

const onChange = () => {
	emit('change', switchState.value);
};
</script>
