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

					<ConfirmationDialog
						title="Purge all anonymous files?"
						message="This action will remove every upload that doesn't belong to a specific user. This is not reversible. Are you sure?"
						:callback="doPurgeAnonymousFiles"
					>
						<Button variant="destructive">Purge all anonymous uploads</Button>
					</ConfirmationDialog>
				</div>
			</div>

			<FilesWrapper type="admin" />
		</div>
	</ScrollArea>
</template>

<script setup lang="ts">
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';
import ConfirmationDialog from '~/components/dialogs/ConfirmationDialog.vue';
import FilesWrapper from '~/components/wrappers/FilesWrapper.vue';
import { publicOnly } from '~/store/files';
import { purgeAnonymousFiles } from '~/use/api';

const queryClient = useQueryClient();

const { mutate: mutatePurgeAnonymousFiles } = useMutation({
	mutationFn: () => purgeAnonymousFiles()
});

const doPurgeAnonymousFiles = async () => {
	mutatePurgeAnonymousFiles(undefined, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'files'] });
			toast.success('Anonymous files purged');
		}
	});
};
</script>
