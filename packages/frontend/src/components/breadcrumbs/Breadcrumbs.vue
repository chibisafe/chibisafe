<template>
	<nav class="flex mt-8" aria-label="Breadcrumb">
		<ol role="list" class="flex space-x-4 rounded-md bg-white dark:bg-dark-90 px-6 shadow mobile:flex-wrap">
			<li class="flex">
				<div class="flex items-center">
					<router-link
						to="/"
						class="text-gray-400 hover:text-gray-500 dark:text-light-100 dark:hover:text-white"
					>
						<IconHome class="h-5 w-5 flex-shrink-0" aria-hidden="true" />
						<span class="sr-only">Home</span>
					</router-link>
				</div>
			</li>
			<li class="flex">
				<div class="flex items-center h-12">
					<IconChevronRight class="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
					<router-link
						to="/dashboard/uploads"
						class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-light-100 dark:hover:text-white"
						>Dashboard
					</router-link>
				</div>
			</li>
			<li v-for="page in pages" :key="page.name" class="flex">
				<div class="flex items-center h-12">
					<IconChevronRight class="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
					<router-link
						:to="page.href"
						class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-light-100 dark:hover:text-white"
						>{{ page.name }}
					</router-link>
				</div>
			</li>
		</ol>
	</nav>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import IconHome from '~icons/carbon/home';
import IconChevronRight from '~icons/carbon/chevron-right';

interface Page {
	name: string;
	href: string;
}

const props = defineProps({
	pages: {
		type: Array as PropType<Page[]>,
		required: true
	}
});
</script>
