<template>
	<div class="my-4 bg-dark-90 h-14 mobile:h-auto px-2 mobile:py-2 flex items-center mobile:flex-wrap">
		<button
			type="button"
			class="bg-dark-80 text-light-100 p-2 h-10 mr-2"
			:title="preferMasonry ? 'Switch to list' : 'Switch to masonry'"
			@click="toggleMasonry"
		>
			<LayoutListIcon v-if="preferMasonry" />
			<LayoutDashboardIcon v-else />
		</button>
		<!-- <button type="button" class="bg-dark-80 text-light-100 p-2 h-10" @click="nothing">Bulk actions</button> -->
		<!-- Pagination -->
		<div class="flex-grow" />
		<span class="text-light-100">{{ data?.count }} files</span>
		<div class="desktop:flex-grow mobile:basis-full mobile:h-2" />
		<Pagination
			:currentPage="page"
			:count="data?.count ?? 0"
			:limit="limit"
			:previousPageFn="prevPage"
			:nextPageFn="nextPage"
			:goToPageFn="goToPage"
			class="mobile:basis-full"
		/>
	</div>

	<Masonry v-if="preferMasonry" :type="type" :files="data?.files ?? []" />
	<FilesTable v-else :type="type" />

	<div class="my-4 bg-dark-90 h-14 mobile:h-auto px-2 mobile:py-2 flex items-center mobile:flex-wrap mobile:mb-20">
		<button
			type="button"
			class="bg-dark-80 text-light-100 p-2 h-10 mr-2"
			:title="preferMasonry ? 'Switch to list' : 'Switch to masonry'"
			@click="toggleMasonry"
		>
			<LayoutListIcon v-if="preferMasonry" />
			<LayoutDashboardIcon v-else />
		</button>
		<!-- <button type="button" class="bg-dark-80 text-light-100 p-2 h-10" @click="nothing">Bulk actions</button> -->
		<!-- Pagination -->
		<div class="flex-grow" />
		<span class="text-light-100">{{ data?.count }} files</span>
		<div class="desktop:flex-grow mobile:basis-full mobile:h-2" />
		<Pagination
			:currentPage="page"
			:count="data?.count ?? 0"
			:limit="limit"
			:previousPageFn="prevPage"
			:nextPageFn="nextPage"
			:goToPageFn="goToPage"
			class="mobile:basis-full"
		/>
	</div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { LayoutDashboardIcon, LayoutListIcon } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getFiles } from '@/use/api';
import Masonry from '~/components/masonry/Masonry.vue';
import Pagination from '~/components/pagination/Pagination.vue';
import FilesTable from '~/components/table/FilesTable.vue';
import { useUserStore } from '~/store/user';

defineProps<{
	type: 'admin' | 'album' | 'uploads';
}>();

const userStore = useUserStore();
const route = useRoute();

const page = ref(route.query.page ? Number(route.query.page ?? 1) : 1);
const limit = ref(50);
const { data } = useQuery({
	queryKey: ['files', page],
	queryFn: () => getFiles(page.value, limit.value),
	keepPreviousData: true
});

const prevPage = () => {
	page.value = Math.max(page.value - 1, 1);
};

const nextPage = () => {
	page.value = Math.min(page.value + 1, data.value.count);
};

const goToPage = (goTo: number) => {
	page.value = goTo;
};

const preferMasonry = computed(() => userStore.preferences.preferMasonry);
const toggleMasonry = () => {
	userStore.preferences.preferMasonry = !userStore.preferences.preferMasonry;
	userStore.savePreferences();
};
</script>
