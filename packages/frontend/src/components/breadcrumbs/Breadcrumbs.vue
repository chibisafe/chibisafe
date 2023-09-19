<template>
	<nav class="flex mt-8" aria-label="Breadcrumb">
		<ol role="list" class="flex space-x-4 rounded-md bg-dark-90 px-6 shadow mobile:flex-wrap">
			<li class="flex">
				<div class="flex items-center">
					<router-link to="/" class="text-light-100 hover:text-white">
						<HomeIcon class="h-5 w-5 flex-shrink-0" aria-hidden="true" />
						<span class="sr-only">Home</span>
					</router-link>
				</div>
			</li>
			<li class="flex">
				<div class="flex items-center h-12">
					<ChevronRightIcon class="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
					<router-link
						to="/dashboard/uploads"
						class="ml-4 text-sm font-medium text-light-100 hover:text-white"
						>Dashboard
					</router-link>
				</div>
			</li>
			<li v-for="page in pages" :key="page.name" class="flex">
				<div class="flex items-center h-12">
					<ChevronRightIcon class="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
					<router-link :to="page.href" class="ml-4 text-sm font-medium text-light-100 hover:text-white"
						>{{ page.name }}
					</router-link>
				</div>
			</li>
		</ol>
	</nav>
</template>

<script lang="ts" setup>
import { HomeIcon, ChevronRightIcon } from 'lucide-vue-next';
import type { PropType } from 'vue';

interface Page {
	name: string;
	href: string;
}
defineProps({
	pages: {
		type: Array as PropType<Page[]>,
		required: true
	}
});
</script>
