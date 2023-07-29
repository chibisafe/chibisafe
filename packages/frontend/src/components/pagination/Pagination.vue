<template>
	<div class="flex items-center mobile:justify-center">
		<span class="text-light-100 mr-4 mobile:hidden">Page {{ page }} of {{ Math.ceil(total / 50) }}</span>
		<span class="text-light-100 mr-4 desktop:hidden">{{ page }} / {{ Math.ceil(total / 50) }}</span>
		<button
			:disabled="isFirstPage"
			type="button"
			:class="[isFirstPage ? 'cursor-not-allowed bg-dark-90' : 'bg-dark-80']"
			class="text-light-100 p-2 h-10 mr-2"
			@click="previousPage"
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
			@click="nextPage"
		>
			<ChevronRightIcon />
		</button>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next';
const props = defineProps<{
	currentPage: number;
	count: number;
	previousPageFn: Function;
	nextPageFn: Function;
	goToPageFn: Function;
}>();

const route = useRoute();
const router = useRouter();

const page = computed(() => props.currentPage);
const total = computed(() => props.count);
const totalPages = computed(() => Math.ceil(total.value / 50));
const isFirstPage = computed(() => props.currentPage === 1);
const isLastPage = computed(() => props.currentPage === totalPages.value);

const previousPage = async () => {
	await props.previousPageFn();

	const query = { ...route.query };
	if (page.value === 1) {
		delete query.page;
	} else {
		query.page = String(page.value);
	}

	await router.replace({ query });
};

const nextPage = async () => {
	await props.nextPageFn();

	const query = { ...route.query };
	query.page = String(page.value);
	await router.replace({ query });
};

const goToPage = async (event: Event) => {
	if (!event.target) return;
	const target = event.target as HTMLSelectElement;
	const pageNum = Number(target.value);

	await props.goToPageFn(pageNum);

	const query = { ...route.query };
	if (pageNum === 1) delete query.page;
	else query.page = String(pageNum);
	await router.replace({ query });
};
</script>
