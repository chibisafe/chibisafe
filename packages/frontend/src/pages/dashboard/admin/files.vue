<template>
	<Sidebar>
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
					}
				]"
			/>

			<div class="mt-8 flex justify-center items-center">
				<h1 class="text-2xl font-semibold text-light-100">All uploads</h1>
				<div class="flex-1"></div>
				<div class="flex flex-col">
					<SwitchGroup>
						<div class="flex items-center">
							<SwitchLabel class="mr-4 text-light-100">Show anonymous uploads only</SwitchLabel>
							<Switch
								v-model="publicOnly"
								:class="publicOnly ? 'bg-blue-400' : 'bg-gray-200'"
								class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-indigo-500 focus:ring-offset-2 ring-0 focus:outline-none focus:ring-0 dark:border-gray-600"
							>
								<span
									:class="publicOnly ? 'translate-x-6' : 'translate-x-1'"
									class="inline-block h-4 w-4 transform rounded-full bg-white dark:bg-dark-90 transition-transform ring-0"
								/>
							</Switch>
						</div>
					</SwitchGroup>

					<button
						type="button"
						class="mt-4 bg-red-900 hover:bg-red-600 text-light-100 font-semibold py-2 px-4 rounded items-center text-center text-base"
						@click="() => (modalStore.generic.show = true)"
					>
						Purge all anonymous uploads
					</button>

					<GenericConfirmationModal
						title="Purge all anonymous files?"
						message="This action will remove every upload that doesn't belong to a specific user. This is not reversible. Are you sure?"
						action-text="Purge anonymous files"
						:callback="doPurgeAnonymousFiles"
					/>
				</div>
			</div>

			<FilesWrapper type="admin" />
		</div>
	</Sidebar>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useFilesStore, useModalStore } from '~/store';
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue';
import { purgeAnonymousFiles } from '~/use/api';
import Sidebar from '~/components/sidebar/Sidebar.vue';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';
import FilesWrapper from '~/components/wrappers/FilesWrapper.vue';
import GenericConfirmationModal from '~/components/modals/GenericConfirmationModal.vue';

const route = useRoute();
const filesStore = useFilesStore();
const modalStore = useModalStore();
const publicOnly = ref(false);

const doPurgeAnonymousFiles = async () => {
	await purgeAnonymousFiles();
	void filesStore.get({ admin: true, publicOnly: publicOnly.value });
};

watch(
	() => publicOnly.value,
	() => {
		void filesStore.get({ admin: true, publicOnly: publicOnly.value });
	},
	{ immediate: true }
);

const checkRouteQuery = () => {
	if (route.query.page) {
		const pageNum = Number(route.query.page);
		if (!Number.isNaN(pageNum)) {
			void filesStore.get({ admin: true, page: pageNum });
			return;
		}

		void filesStore.get({ admin: true });
	}

	void filesStore.get({ admin: true });
};

checkRouteQuery();
</script>
