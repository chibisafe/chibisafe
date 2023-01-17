<template>
	<div class="my-4 bg-dark-90 h-14 px-2 flex items-center">
		<button type="button" class="bg-dark-80 text-light-100 p-2 h-10 mr-2" @click="toggleMasonry">
			Toggle view
		</button>
		<button type="button" class="bg-dark-80 text-light-100 p-2 h-10" @click="nothing">Bulk operations</button>
	</div>

	<Masonry v-if="preferMasonry" :type="type" />
	<FilesTable v-else :type="type" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Masonry from '~/components/masonry/Masonry.vue';
import FilesTable from '~/components/table/FilesTable.vue';
import { useUserStore } from '~/store/user';

const props = defineProps<{
	type: 'admin' | 'album' | 'uploads';
}>();

const userStore = useUserStore();
const preferMasonry = computed(() => userStore.preferences.preferMasonry);
const toggleMasonry = () => {
	userStore.preferences.preferMasonry = !userStore.preferences.preferMasonry;
	userStore.savePreferences();
};

const nothing = () => {};
</script>
