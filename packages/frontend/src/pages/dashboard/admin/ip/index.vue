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
						name: 'Banned IPs',
						href: '/dashboard/admin/ip'
					}
				]"
			/>
			<h1 class="text-2xl mt-8 font-semibold text-light-100 flex items-center">
				<span class="desktop:whitespace-nowrap">List of banned IPs</span>
				<span class="grow h-1 w-full"></span>
				<InputDialog
					message="The IP you submit in the field below will be denied access to the platform until you remove the ban. Be careful"
					title="Ban new IP"
					variant="destructive"
					:callback="doBanIP"
				>
					<span class="block w-20">Ban new IP</span>
				</InputDialog>
			</h1>
			<div class="">
				<Table class="mt-12 bg-dark-110">
					<TableHeader>
						<TableRow>
							<TableHead class="text-left">IP</TableHead>
							<TableHead class="text-left">Date</TableHead>
							<TableHead class="text-right" />
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow v-for="ip in IPs" :key="ip.id">
							<TableCell>
								{{ ip.ip }}
							</TableCell>
							<TableCell>
								<Tooltip :text="dayjs(ip.createdAt).format('MMMM D, YYYY h:mm A')">{{
									dayjs().to(ip.createdAt)
								}}</Tooltip>
							</TableCell>
							<TableCell class="flex justify-end">
								<Button
									class="mr-2"
									as="router-link"
									variant="default"
									:to="`/dashboard/admin/ip/${ip.ip}`"
								>
									View files
								</Button>

								<ConfirmationDialog
									title="Unban IP"
									message="This will let the affected IP interact with chibisafe services again. Are you sure?"
									variant="destructive"
									:callback="() => doUnbanIP(ip.ip)"
								>
									Unban IP
								</ConfirmationDialog>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>
	</ScrollArea>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { banIP, unbanIP, purgeFilesFromIP, getBannedIPs } from '@/use/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import InputDialog from '@/components/dialogs/InputDialog.vue';
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs.vue';
import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog.vue';
import Tooltip from '@/components/tooltip/Tooltip.vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
const IPs = ref<any>([]);

onMounted(async () => {
	void fetchBans();
});

const doBanIP = async (ip: string) => {
	await banIP(ip);
	void fetchBans();
};

const doUnbanIP = async (ip: string) => {
	await unbanIP(ip);
	void fetchBans();
};

const fetchBans = async () => {
	IPs.value = await getBannedIPs();
};
</script>
