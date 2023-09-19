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
						name: 'Statistics',
						href: '/dashboard/admin/statistics'
					}
				]"
			/>
			<h1 class="text-2xl mt-8 mb-8 font-semibold text-light-100 flex items-center">
				Statistics
				<RepeatIcon
					class="ml-4 w-6 h-6 cursor-pointer"
					:class="loading ? 'animate-spin text-gray-500' : 'text-light-100'"
					@click="fetchStats(true)"
				/>
			</h1>

			<template v-if="stats">
				<div v-for="obj in stats" :key="obj[0]" class="bg-dark-90 w-full mb-4">
					<div v-for="(value, key) in obj" :key="key" class="p-4 text-light-100 relative">
						<h3 class="text-2xl mb-4 capitalize">{{ key }}</h3>
						<div v-for="(val, item) in value" :key="item" class="columns-2 flex">
							<!-- @ts-ignore -->
							<template v-if="String(item) !== 'meta'">
								<span class="w-52">{{ item }}:</span>
								<span v-if="val.type === 'byte'">
									{{ formatBytes(val.value) }}
								</span>
								<span v-else-if="val.type === 'byteUsage'">
									{{ `${formatBytes(val.value.used)} / ${formatBytes(val.value.total)}` }}
									<span v-if="val.value.available"
										>({{ formatBytes(val.value.available) }} available)</span
									>
								</span>
								<span v-else-if="val.type === 'time'">
									{{ dayjs.duration(val.value, 'seconds').humanize() }}
								</span>
								<span v-else-if="val.type === 'unavailable'"> Unavailable </span>
								<span v-else>{{ val }}</span>
							</template>
							<template v-else>
								<div class="absolute top-4 right-4 flex">
									Generated on {{ dayjs(val.generatedOn).format('MMMM D, YYYY h:mm A') }}
								</div>
							</template>
						</div>
					</div>
				</div>
			</template>
			<span v-else class="text-light-100">Loading...</span>
		</div>
	</ScrollArea>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { RepeatIcon } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';
import { getStatistics } from '~/use/api';
import { formatBytes } from '~/use/file';
dayjs.extend(duration);
dayjs.extend(relativeTime);

const stats = ref(null) as any;
const loading = ref(false);

const fetchStats = async (forced: boolean = false) => {
	if (loading.value) return;
	// Only spin if forced by clicking on the icon
	if (forced) loading.value = true;
	const response = await getStatistics(forced);
	// eslint-disable-next-line require-atomic-updates
	loading.value = false;
	if (!response) return;
	stats.value = response;
};

onMounted(async () => {
	await fetchStats();
});
</script>
