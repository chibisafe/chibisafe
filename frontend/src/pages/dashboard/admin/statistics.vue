<template>
	<Sidebar>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-screen overflow-auto">
			<Breadcrumbs
				:pages="[
					{
						name: 'Admin',
						href: '/dashboard/admin/files'
					},
					{
						name: 'Statistics',
						href: '/dashboard/admin/statistics'
					}
				]"
			/>
			<h1 class="text-2xl mt-8 font-semibold text-light-100">Statistics</h1>

			<pre v-if="stats">
				<code class="prose text-light-100">{{ stats }}</code>
			</pre>
			<span v-else class="text-light-100">Loading...</span>
		</div>
	</Sidebar>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getStatistics } from '~/use/api';
import Sidebar from '~/components/sidebar/Sidebar.vue';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';

const stats = ref(null) as any;

onMounted(async () => {
	const response = await getStatistics();
	if (!response) return;
	stats.value = response;
});
</script>
