<template>
	<Accordion :items="accordionData" @change="$toast?.success"></Accordion>

	<div class="mt-6 pt-6 border-t-[1px] border-theme-600 dark:border-theme-300">
		<Checkbox v-model="checkbox1">This is a checkbox</Checkbox>
		<Checkbox v-model="checkbox2" inverted class="mt-4">This is an inverted checkbox</Checkbox>
	</div>

	<div class="mt-6 pt-6 border-t-[1px] border-theme-600 dark:border-theme-300">
		<Switch v-model="switch1">This is a switch</Switch>
		<Switch v-model="switch2" inverted class="mt-4">This is an inverted switch</Switch>
		<Switch v-model="switch3" inverted class="mt-4"></Switch>
	</div>

	<div class="mt-6 pt-6 border-t-[1px] border-theme-600 dark:border-theme-300">
		<Input v-model="inputText" label="This is a label" placeholder="This is a placeholder" />
	</div>

	<div class="mt-6 pt-6 border-t-[1px] border-theme-600 dark:border-theme-300">
		<Combobox :data="comboboxData" @change="$toast?.success" />
	</div>

	<div class="mt-6 pt-6 border-t-[1px] border-theme-600 dark:border-theme-300 flex flex-col">
		<Button class="mt-2">This is a button</Button>
		<Button class="mt-2" variant="success">This is a success button</Button>
		<Button class="mt-2" variant="destructive">This is a destructive button</Button>
		<Button class="mt-2" :loading="isButtonLoading" @click="setButtonLoading"
			>This becomes a loading button after you click it</Button
		>
		<Button class="mt-8" disabled>This is a disabled button</Button>
		<Button class="mt-2" disabled variant="success">This is a disabled success button</Button>
		<Button class="mt-2" disabled variant="destructive">This is a disabled destructive button</Button>

		<Button class="mt-8"><HomeIcon /></Button>
		<Button class="mt-2" variant="destructive"><Trash2Icon /></Button>
		<Button class="mt-2"><HomeIcon class="mr-2" />with text</Button>
		<Button class="mt-2" variant="success" disabled><CheckIcon /></Button>
	</div>
</template>

<script setup lang="ts">
import { HomeIcon, Trash2Icon, CheckIcon } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import Accordion from '@/components/ui/accordion/Accordion.vue';
import Button from '@/components/ui/button/Button.vue';
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';
import Input from '@/components/ui/input/Input.vue';
import Switch from '@/components/ui/switch/Switch.vue';
import Combobox from '~/components/ui/combobox/Combobox.vue';

const accordionData = [
	{
		title: 'React',
		content: 'React content'
	},
	{
		title: 'Solid',
		content: 'Solid content'
	},
	{
		title: 'Vue',
		content: 'Vue content'
	}
];

const checkbox1 = ref(false);
const checkbox2 = ref(false);
const switch1 = ref(false);
const switch2 = ref(false);
const switch3 = ref(false);

const inputText = ref('');
const isButtonLoading = ref(false);

const comboboxData = ['React', 'Solid', 'Vue'];

const setButtonLoading = () => {
	isButtonLoading.value = true;

	window.setTimeout(() => {
		isButtonLoading.value = false;
	}, 2000);
};

onMounted(() => {
	debug('mounted');
});
</script>
