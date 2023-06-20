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
						name: 'IPs',
						href: '/dashboard/admin/ip'
					},
					{
						name: props.ip,
						href: '/dashboard/admin/ip/' + props.ip
					}
				]"
			/>
			<h1 class="text-2xl mt-8 font-semibold text-light-100 flex items-center">
				{{ props.ip }} uploads ({{ totalFiles }} files)
				<span class="grow h-1 w-full"></span>

				<div class="items-center my-8">
					<button
						v-if="isBanned"
						type="button"
						class="bg-green-700 hover:bg-green-800 text-light-100 font-semibold py-2 px-4 rounded items-center w-64 text-center text-base"
						@click="modalStore.generic.show = true"
					>
						Unban IP
					</button>
					<button
						v-else
						type="button"
						class="bg-red-600 hover:bg-red-900 text-light-100 font-semibold py-2 px-4 rounded items-center w-64 text-center text-base"
						@click="modalStore.generic.show = true"
					>
						Ban IP
					</button>
				</div>
			</h1>
			<FilesWrapper type="admin" />
		</div>
		<GenericConfirmationModal
			v-if="isBanned"
			title="Unban IP?"
			message="This will let the affected IP interact with chibisafe services again. Are you sure?"
			action-text="Unban ip"
			:callback="doUnbanIP"
		/>
		<GenericConfirmationModal
			v-else
			title="Ban IP?"
			message="Are you sure you want to ban this IP? Once confirmed, said IP won't be able to interact with chibisafe in any way until you unban it."
			action-text="Ban ip"
			:callback="doBanIP"
		/>
	</Sidebar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useFilesStore, useModalStore } from '~/store';
import { banIP, unbanIP } from '~/use/api';
import Sidebar from '~/components/sidebar/Sidebar.vue';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';
import FilesWrapper from '~/components/wrappers/FilesWrapper.vue';
import GenericConfirmationModal from '~/components/modals/GenericConfirmationModal.vue';

const props = defineProps<{
	ip: string;
}>();

const route = useRoute();
const filesStore = useFilesStore();
const modalStore = useModalStore();
const totalFiles = computed(() => filesStore.count);
const isBanned = computed(() => filesStore.isBanned);

const checkRouteQuery = () => {
	if (route.query.page) {
		const pageNum = Number(route.query.page);
		if (!Number.isNaN(pageNum)) {
			void filesStore.get({ admin: true, ip: props.ip, page: pageNum });
			return;
		}

		void filesStore.get({ admin: true, ip: props.ip, page: pageNum });
	}

	void filesStore.get({ admin: true, ip: props.ip });
};

const doBanIP = async () => {
	await banIP(props.ip);
	filesStore.isBanned = true;
};

const doUnbanIP = async () => {
	await unbanIP(props.ip);
	filesStore.isBanned = false;
};

checkRouteQuery();
</script>
