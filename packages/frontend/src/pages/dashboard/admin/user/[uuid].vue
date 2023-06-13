<template>
	<Sidebar>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-screen">
			<Breadcrumbs
				:pages="[
					{
						name: 'Admin',
						href: '/dashboard/admin/files'
					},
					{
						name: 'Users',
						href: '/dashboard/admin/users'
					},
					{
						name: user.username,
						href: '/dashboard/admin/user/' + props.uuid
					}
				]"
			/>
			<h1 class="text-2xl mt-8 font-semibold text-light-100">
				{{ user.username }} uploads ({{ totalFiles }} files)
			</h1>
			<FilesWrapper type="admin" />
		</div>
	</Sidebar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useFilesStore } from '~/store/files';
import Sidebar from '~/components/sidebar/Sidebar.vue';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';
import FilesWrapper from '~/components/wrappers/FilesWrapper.vue';

const props = defineProps<{
	uuid: string;
}>();

const route = useRoute();
const filesStore = useFilesStore();
const totalFiles = computed(() => filesStore.count);
const user = computed(() => filesStore.owner);

const checkRouteQuery = () => {
	if (route.query.page) {
		const pageNum = Number(route.query.page);
		if (!Number.isNaN(pageNum)) {
			void filesStore.get({ admin: true, userUuid: props.uuid, page: pageNum });
			return;
		}

		void filesStore.get({ admin: true, page: pageNum });
	}

	void filesStore.get({ admin: true, userUuid: props.uuid });
};

checkRouteQuery();
</script>
