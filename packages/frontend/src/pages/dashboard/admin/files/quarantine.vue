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

			<div class="mt-8 flex justify-center items-center">
				<h1 class="text-2xl font-semibold text-light-100">All uploads</h1>
				<div class="flex-1"></div>
				<div class="flex flex-col">
					<SwitchGroup>
						<div class="flex items-center mb-2">
							<SwitchLabel class="mr-4 text-light-100">Show anonymous uploads only</SwitchLabel>
							<Switch
								v-model="publicOnly"
								:class="publicOnly ? 'bg-blue-400' : 'bg-gray-200'"
								class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-indigo-500 focus:ring-offset-2 ring-0 focus:outline-none focus:ring-0 border-gray-600"
							>
								<span
									:class="publicOnly ? 'translate-x-6' : 'translate-x-1'"
									class="inline-block h-4 w-4 transform rounded-full bg-dark-90 transition-transform ring-0"
								/>
							</Switch>
						</div>
					</SwitchGroup>
				</div>
			</div>

			<FilesWrapper type="admin" />
		</div>
	</ScrollArea>
</template>

<script setup lang="ts">
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ScrollArea } from '@/components/ui/scroll-area';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';
import FilesWrapper from '~/components/wrappers/FilesWrapper.vue';
import { useFilesStore } from '~/store';

const route = useRoute();
const filesStore = useFilesStore();
const publicOnly = ref(false);

watch(
	() => publicOnly.value,
	() => {
		void filesStore.get({ admin: true, publicOnly: publicOnly.value, quarantine: true });
	},
	{ immediate: true }
);

const checkRouteQuery = () => {
	if (route.query.page) {
		const pageNum = Number(route.query.page);
		if (!Number.isNaN(pageNum)) {
			void filesStore.get({ admin: true, page: pageNum, quarantine: true });
			return;
		}

		void filesStore.get({ admin: true, quarantine: true });
	}

	void filesStore.get({ admin: true, quarantine: true });
};

checkRouteQuery();
</script>
