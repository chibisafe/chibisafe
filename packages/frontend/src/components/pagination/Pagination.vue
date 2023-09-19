<template>
	<div class="flex items-center mobile:justify-center">
		<span class="text-light-100 mr-4 mobile:hidden">Page {{ page }} of {{ Math.ceil(total / limit) }}</span>
		<span class="text-light-100 mr-4 desktop:hidden">{{ page }} / {{ Math.ceil(total / limit) }}</span>
		<button
			:disabled="isFirstPage"
			type="button"
			:class="[isFirstPage ? 'cursor-not-allowed bg-dark-90' : 'bg-dark-80']"
			class="text-light-100 p-2 h-10 mr-2"
			@click="previousPageFn"
		>
			<ChevronLeftIcon />
		</button>
		<select :value="page" class="bg-dark-80 text-light-100 h-10 mr-2" @change="goToPage">
			<option v-for="index in totalPages" :key="index" :value="index">{{ index }}</option>
		</select>
		<button
			:disabled="isLastPage"
			type="button"
			:class="[isLastPage ? 'cursor-not-allowed bg-dark-90' : 'bg-dark-80']"
			class="text-light-100 p-2 h-10"
			@click="nextPageFn"
		>
			<ChevronRightIcon />
		</button>
	</div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next';
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const props = defineProps<{
	currentPage: number;
	count: number;
	limit: number;
	previousPageFn: () => void;
	nextPageFn: () => void;
	// eslint-disable-next-line no-unused-vars
	goToPageFn: (goTo: number) => void;
}>();

const route = useRoute();
const router = useRouter();

const page = computed(() => props.currentPage);
const total = computed(() => props.count || 1);
const totalPages = computed(() => Math.ceil(total.value / props.limit));
const isFirstPage = computed(() => props.currentPage === 1);
const isLastPage = computed(() => props.currentPage === totalPages.value);

const goToPage = async (event: Event) => {
	if (!event.target) return;
	const target = event.target as HTMLSelectElement;
	const pageNum = Number(target.value);

	props.goToPageFn(pageNum);
};

watch(page, async () => {
	const query = { ...route.query };
	query.page = String(page.value);
	if (page.value === 1) delete query.page;
	await router.replace({ query });
});
</script>
