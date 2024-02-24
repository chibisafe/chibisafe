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
						name: 'IP Management',
						href: '/dashboard/admin/ip'
					},
					{
						name: props.ip,
						href: '/dashboard/admin/ip/' + props.ip
					}
				]"
			/>
			<div class="mt-8 font-semibold text-light-100 flex items-center justify-between">
				<h1 class="text-2xl desktop:whitespace-nowrap">{{ props.ip }} uploads ({{ data?.count }} files)</h1>

				<div class="items-center my-8 flex">
					<ConfirmationDialog
						v-if="data?.banned"
						title="Unban IP"
						message="This will let the affected IP interact with chibisafe services again. Are you sure?"
						:callback="doUnbanIP"
					>
						<Button variant="destructive">Unban IP</Button>
					</ConfirmationDialog>

					<ConfirmationDialog
						v-else
						title="Ban IP"
						message="Are you sure you want to ban this IP? Once confirmed, said IP won't be able to interact with chibisafe in any way until you unban it."
						:callback="doBanIP"
					>
						<Button variant="destructive">Ban IP</Button>
					</ConfirmationDialog>

					<div class="ml-2">
						<ConfirmationDialog
							title="Ban IP"
							message="Are you sure you want to ban this IP? Once confirmed, said IP won't be able to interact with chibisafe in any way until you unban it."
							:callback="doPurgeFiles"
						>
							<Button variant="destructive">Purge all files from this IP</Button>
						</ConfirmationDialog>
					</div>
				</div>
			</div>
			<FilesWrapper type="admin" :ip="ip" />
		</div>
	</ScrollArea>
</template>

<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';
import ConfirmationDialog from '~/components/dialogs/ConfirmationDialog.vue';
import FilesWrapper from '~/components/wrappers/FilesWrapper.vue';
import { banIP, unbanIP, purgeFilesFromIP, getFilesFromIP } from '~/use/api';

const props = defineProps<{
	ip: string;
}>();

const userIp = computed(() => props.ip);

const queryClient = useQueryClient();

const { data } = useQuery({
	queryKey: ['admin', 'ip', userIp, 'files'],
	queryFn: () => getFilesFromIP(userIp.value, 1, 1),
	placeholderData: (previousData: any) => previousData
});

const { mutate: mutatePurgeFiles } = useMutation({
	mutationFn: (ip: string) => purgeFilesFromIP(ip)
});

const { mutate: mutateBanIp } = useMutation({
	mutationFn: (ip: string) => banIP(ip)
});

const { mutate: mutateUnbanIp } = useMutation({
	mutationFn: (ip: string) => unbanIP(ip)
});

const doPurgeFiles = async () => {
	mutatePurgeFiles(props.ip, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'ip', userIp, 'files'] });
		}
	});
};

const doBanIP = async () => {
	mutateBanIp(props.ip, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'ip', userIp, 'files'] });
		}
	});
};

const doUnbanIP = async () => {
	mutateUnbanIp(props.ip, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'ip', userIp, 'files'] });
		}
	});
};
</script>
