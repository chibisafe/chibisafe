<template>
	<input
		v-model="enteredTag"
		class="shadow focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-sm text-dark-100"
		type="text"
		placeholder="Type then press ENTER to create the tag"
		@keyup.enter="createTag"
	/>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTagsStore } from '~/store/tags';

const props = defineProps<{ fileUuid: string | null }>();

const isLoading = ref(false);
const enteredTag = ref('');
const tagsStore = useTagsStore();

const tags = computed(() => tagsStore.tags);

const createTag = async () => {
	if (enteredTag.value === '') return;
	if (tags.value.some(tag => tag.name === enteredTag.value)) {
		enteredTag.value = '';
		return;
	}

	await tagsStore.create(enteredTag.value);
};
</script>
