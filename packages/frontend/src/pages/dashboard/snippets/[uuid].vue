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
							<button
								type="button"
								class="text-red-400 hover:text-red-500 transition-colors duration-200 ml-4"
								@click="showDeleteSnippetModal"
							>
								Delete snippet
							</button>
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
		<GenericConfirmationModal
			title="Delete snippet?"
			message="This will completely remove the snippet, and link to it will stop working. Are you sure?"
			action-text="Delete"
			:callback="confirmDeleteSnippet"
		/>
	</Sidebar>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getSnippet, deleteSnippet } from '~/use/api';
import type { Snippet } from '~/types';
import Sidebar from '~/components/sidebar/Sidebar.vue';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';
import hljsVuePlugin from '@highlightjs/vue-plugin';
import 'highlight.js/styles/github-dark.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import GenericConfirmationModal from '~/components/modals/GenericConfirmationModal.vue';
import { useModalStore } from '~/store';
import { useRouter } from 'vue-router';

const props = defineProps<{
	uuid: string;
}>();

const modalStore = useModalStore();
const router = useRouter();
const snippet = ref<Snippet>();

const showDeleteSnippetModal = () => {
	modalStore.generic.show = true;
};

const confirmDeleteSnippet = async () => {
	await deleteSnippet(props.uuid);
	modalStore.generic.show = false;
	await router.push('/dashboard/snippets');
};

onMounted(async () => {
	snippet.value = await getSnippet(props.uuid);
});

dayjs.extend(relativeTime);
</script>
