<template>
	<ScrollArea class="w-full">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<Breadcrumbs
				:pages="[
					{
						name: 'Snippets',
						href: '/dashboard/snippets'
					}
				]"
			/>
			<h1 class="text-2xl mt-8 font-semibold text-light-100">Snippets</h1>
			<div class="my-4 h-automobile:py-2 flex mobile:flex-wrap flex-col">
				<div v-for="snippet in snippets" :key="snippet.uuid" class="w-full flex-1 mb-4">
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
					<router-link
						:to="`/dashboard/snippets/${snippet.uuid}`"
						class="relative after:hidden hover:after:flex after:content-['View'] after:absolute after:w-full after:h-full after:top-0 after:left-0 after:bg-dark-110 after:opacity-80 after:text-white after:text-4xl after:text-center after:items-center after:justify-center"
					>
						<span
							class="bg-black/30 absolute top-0 right-0 uppercase font-bold text-xs rounded-bl-md px-2 py-1 text-light-100"
						>
							{{ snippet.language }}
						</span>
						<Highlight :language="snippet.language" :code="snippet.content" />
					</router-link>
				</div>
			</div>
		</div>
	</ScrollArea>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { onMounted, ref } from 'vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';
import Highlight from '~/components/highlight/Highlight.vue';
import type { Snippet } from '~/types';
import { getSnippets } from '~/use/api';
dayjs.extend(relativeTime);

const snippets = ref<Snippet[]>([]);

onMounted(async () => {
	const response = await getSnippets();
	snippets.value = response.map((snippet: Snippet) => ({
		...snippet,
		// Grab only the first 10 lines of the snippet
		content: snippet.content.split('\n').slice(0, 10).join('\n')
	}));
});
</script>
