<template>
	<Sidebar>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<Breadcrumbs
				:pages="[
					{
						name: 'Snippets',
						href: '/dashboard/snippets'
					},
					{
						name: snippet?.name ?? 'Loading...',
						href: '/dashboard/snippets/' + props.uuid
					}
				]"
			/>
			<h1 class="text-2xl mt-8 font-semibold text-light-100">{{ snippet?.name ?? 'Loading...' }}</h1>
			<div v-if="snippet" class="my-4 h-automobile:py-2 flex mobile:flex-wrap flex-col">
				<div class="w-full flex-1 mb-4">
					<div class="flex items-center">
						<div class="mb-2">
							<p class="text-light-100">Name: {{ snippet.name }}</p>
							<p class="text-light-100">Created: {{ dayjs(snippet.createdAt).fromNow() }}</p>
						</div>
						<div class="flex-1"></div>
						<div class="mb-2">
							<a
								:href="snippet.link"
								target="_blank"
								rel="noopener noreferrer"
								class="text-blue-400 hover:text-blue-500 transition-colors duration-200"
							>
								Open snippet
							</a>
							<a
								:href="snippet.raw"
								target="_blank"
								rel="noopener noreferrer"
								class="text-blue-400 hover:text-blue-500 transition-colors duration-200 ml-4"
							>
								Open raw
							</a>
						</div>
					</div>
					<div class="relative">
						<span
							class="bg-black/30 absolute top-0 right-0 uppercase font-bold text-xs rounded-bl-md px-2 py-1 text-light-100"
						>
							{{ snippet.language }}
						</span>
						<component :is="hljsVuePlugin.component" :language="snippet.language" :code="snippet.content" />
					</div>
				</div>
			</div>
		</div>
	</Sidebar>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getSnippet } from '~/use/api';
import type { Snippet } from '~/types';
import Sidebar from '~/components/sidebar/Sidebar.vue';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';
import 'highlight.js/styles/github-dark.css';
import hljsVuePlugin from '@highlightjs/vue-plugin';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const props = defineProps<{
	uuid: string;
}>();

dayjs.extend(relativeTime);
const snippet = ref<Snippet>();

onMounted(async () => {
	snippet.value = await getSnippet(props.uuid);
});
</script>
