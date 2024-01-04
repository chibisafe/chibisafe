<template>
	<AlertDialog>
		<AlertDialogTrigger>
			<slot />
		</AlertDialogTrigger>
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>What's new</AlertDialogTitle>
				<ScrollArea>
					<AlertDialogDescription class="max-h-96">
						<template v-for="(release, i) in data" :key="release.version">
							<h3 class="font-bold mt-4 text-white mb-2">
								<a
									:href="release.url"
									target="_blan"
									rel="noopener noreferrer"
									class="hover:text-blue-500"
								>
									{{ release.name }}
								</a>
								<span
									v-if="i === 0 || i === data.length - 1"
									class="text-xs text-light-100 ml-1 px-2 py-1 rounded pointer-events-none select-none bg-dark-80"
								>
									{{ i === 0 ? 'Latest' : i === data.length - 1 ? 'Current' : '' }}
								</span>
							</h3>
							<!-- eslint-disable-next-line vue/no-v-html -->
							<div class="text-sm text-light-100" v-html="renderMarkdown(release.body)" />
						</template>
					</AlertDialogDescription>
				</ScrollArea>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>Close</AlertDialogCancel>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
</template>

<script setup lang="ts">
import { marked } from 'marked';
import xss from 'xss';
import AlertDialog from '@/components/ui/alert-dialog/AlertDialog.vue';
import AlertDialogCancel from '@/components/ui/alert-dialog/AlertDialogCancel.vue';
import AlertDialogContent from '@/components/ui/alert-dialog/AlertDialogContent.vue';
import AlertDialogDescription from '@/components/ui/alert-dialog/AlertDialogDescription.vue';
import AlertDialogFooter from '@/components/ui/alert-dialog/AlertDialogFooter.vue';
import AlertDialogHeader from '@/components/ui/alert-dialog/AlertDialogHeader.vue';
import AlertDialogTitle from '@/components/ui/alert-dialog/AlertDialogTitle.vue';
import AlertDialogTrigger from '@/components/ui/alert-dialog/AlertDialogTrigger.vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { UpdateCheck } from '@/types';

// eslint-disable-next-line no-unused-vars
defineProps<{
	data: UpdateCheck['releaseNotes'];
}>();

marked.use({
	renderer: {
		list(body: string, ordered: boolean) {
			const tag = ordered ? 'ol' : 'ul';
			return `<${tag} class="list-disc pl-5">${body}</${tag}>`;
		},
		listitem(text: string) {
			return `<li class="text-sm text-light-100">${text}</li>`;
		},
		link(href: string, _, text: string) {
			return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-sm text-blue-400 hover:text-blue-500">${text}</a>`;
		},
		image(href: string, _, text: string) {
			return `<img src="${href}" alt="${text}" class="my-2" />`;
		}
	}
});

const renderMarkdown = (markdown: string) => {
	// @ts-expect-error marked.parse returns a string yet ts thinks it might be a promise
	return xss(marked.parse(markdown), {
		whiteList: {
			ol: ['class'],
			ul: ['class'],
			li: ['class'],
			a: ['href', 'title', 'target', 'rel', 'class'],
			img: ['src', 'alt', 'class'],
			code: ['class']
		},
		stripIgnoreTag: true,
		stripIgnoreTagBody: ['script']
	});
};
</script>
