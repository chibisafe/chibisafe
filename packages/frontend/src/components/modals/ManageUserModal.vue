<template>
	<TransitionRoot appear :show="isModalOpen" as="template" @afterLeave="clearStore">
		<Dialog as="div" class="relative z-10" @close="closeModal">
			<TransitionChild
				as="template"
				enter="ease-out duration-300"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="ease-in duration-200"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
			</TransitionChild>

			<div class="fixed inset-0 z-10 overflow-y-auto">
				<div class="flex min-h-full items-end justify-center p-4 text-center desktop:items-center desktop:p-0">
					<TransitionChild
						as="template"
						enter="ease-out duration-300"
						enter-from="opacity-0 translate-y-4 desktop:translate-y-0 desktop:scale-95"
						enter-to="opacity-100 translate-y-0 desktop:scale-100"
						leave="ease-in duration-200"
						leave-from="opacity-100 translate-y-0 desktop:scale-100"
						leave-to="opacity-0 translate-y-4 desktop:translate-y-0 desktop:scale-95"
					>
						<DialogPanel
							class="relative transform overflow-hidden rounded-lg bg-dark-110 px-4 pt-5 pb-4 text-left shadow-xl transition-all desktop:my-8 desktop:w-full desktop:max-w-lg desktop:p-6"
						>
							<div class="absolute top-0 right-0 hidden pt-4 pr-4 desktop:block">
								<button
									type="button"
									class="rounded-md bg-dark-110 text-light-100 hover:text-gray-500 focus:outline-none focus:ring-0 focus:ring-indigo-500 focus:ring-offset-2"
									@click="closeModal"
								>
									<span class="sr-only">Close</span>
									<IconClose class="h-6 w-6" aria-hidden="true" />
								</button>
							</div>
							<div class="desktop:flex desktop:items-start">
								<div class="mt-3 text-center desktop:mt-0 desktop:ml-4 desktop:text-left">
									<DialogTitle as="h3" class="text-lg font-medium leading-6 text-light-100">
										<span class="capitalize">{{ action }} user </span>
										<span class="font-bold">{{ user?.username }}</span>
									</DialogTitle>
									<div class="mt-2 text-sm text-light-100">
										<p v-if="action === 'enable'">
											This action will enable the user and allow them to log into chibisafe again.
											They'll be able to access all previous uploads and albums.<br />
										</p>
										<p v-if="action === 'disable'">
											This action will disable the user and thus prevent them from logging into
											chibisafe again until you enable them once more.<br />
											All uploaded files and albums will remain intact.
										</p>
										<p v-if="action === 'purge'">
											This action will delete ALL files and albums uploaded by the user.<br />
											This action is not reversible.
										</p>
										<p v-if="action === 'promote'">
											This action will promote the user to ADMIN. They'll be able to do everything
											you can do.<br />
											Be careful before promoting anyone to understand the risks.
										</p>
										<p v-if="action === 'demote'">
											This action will demote an ADMIN back to USER.<br />
										</p>
									</div>
								</div>
							</div>
							<div class="mt-5 desktop:mt-4 desktop:flex desktop:flex-row-reverse">
								<button
									type="button"
									class="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-400 focus:outline-none focus:ring-0 focus:ring-red-500 focus:ring-offset-2 desktop:ml-3 desktop:w-auto desktop:text-sm"
									@click="doAction"
								>
									<span class="capitalize">{{ action }}</span>
								</button>
								<button
									type="button"
									class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-0 focus:ring-indigo-500 focus:ring-offset-2 desktop:mt-0 desktop:w-auto desktop:text-sm"
									@click="closeModal"
								>
									Cancel
								</button>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import IconClose from '~icons/carbon/close';
import { enableUser, disableUser, purgeUser, promoteUser, demoteUser } from '~/use/api';

import { useModalStore } from '~/store';

const modalsStore = useModalStore();

const isModalOpen = computed(() => modalsStore.manageUser.show);
const user = computed(() => modalsStore.manageUser.user);
const action = computed(() => modalsStore.manageUser.action);

// Clear the store only after the transition is done to prevent artifacting
const clearStore = () => {
	modalsStore.manageUser.user = null;
	modalsStore.manageUser.action = null;
};

const closeModal = () => {
	modalsStore.manageUser.show = false;
};

const doAction = () => {
	if (!user.value) return;
	if (action.value === 'enable') void enableUser(user.value.uuid);
	if (action.value === 'disable') void disableUser(user.value.uuid);
	if (action.value === 'purge') void purgeUser(user.value.uuid);
	if (action.value === 'promote') void promoteUser(user.value.uuid);
	if (action.value === 'demote') void demoteUser(user.value.uuid);
	closeModal();

	// TODO: Enable 2-way binding for this, otherwise the table won't update until refresh
};
</script>
