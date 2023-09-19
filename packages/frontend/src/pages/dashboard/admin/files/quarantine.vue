<template>
	<ScrollArea class="w-full">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<Breadcrumbs
				:pages="[
					{
						name: 'Admin',
						href: '/dashboard/admin/files'
					},
					{
						name: 'Files',
						href: '/dashboard/admin/files'
					},
					{
						name: 'Quarantine',
						href: '/dashboard/admin/files/quarantine'
					}
				]"
			/>

			<h1 class="text-2xl mt-8 font-semibold text-light-100">All uploads</h1>

			<FilesWrapper type="quarantine" />
		</div>
	</ScrollArea>
</template>

<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';
import FilesWrapper from '~/components/wrappers/FilesWrapper.vue';
</script>
