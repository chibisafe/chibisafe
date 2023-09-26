<template>
	<Accordion :items="accordionData" @change="$toast?.success"></Accordion>
	<Checkbox v-model="asd">This is a checkbox</Checkbox>
	<Input v-model="text" label="This is a label" placeholder="This is a placeholder" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Accordion from '@/components/ui/accordion/Accordion.vue';
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';
import Input from '@/components/ui/input/Input.vue';
const accordionData = ref([
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
]);

const asd = ref(false);
const text = ref('');
</script>
