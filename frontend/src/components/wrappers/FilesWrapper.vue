<template>
	<div class="my-4 bg-dark-90 h-14 px-2 flex items-center">
		<button type="button" class="bg-dark-80 text-light-100 p-2 h-10 mr-2" @click="showMasonry = !showMasonry">
			Toggle view
		</button>
		<button type="button" class="bg-dark-80 text-light-100 p-2 h-10" @click="showMasonry = !showMasonry">
			Bulk operations
		</button>
	</div>

	<Masonry v-if="showMasonry" :type="type" />
	<FilesTable v-else :type="type" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Masonry from '~/components/masonry/Masonry.vue';
import FilesTable from '~/components/table/FilesTable.vue';

const props = defineProps<{
	type: 'admin' | 'album' | 'uploads';
}>();

const showMasonry = ref(true);
</script>
