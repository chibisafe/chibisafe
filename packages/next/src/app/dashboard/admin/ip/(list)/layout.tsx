import { DashboardHeader } from '@/components/DashboardHeader';
import { BanIpDialog } from '@/components/dialogs/BanIpDialog';
import { BanIpDrawer } from '@/components/drawers/BanIpDrawer';
import type { PropsWithChildren } from 'react';

export default function IpLayout({ children }: PropsWithChildren) {
	return (
		<>
			<DashboardHeader
				title="Banned IPs"
				subtitle="Manage banned IPs"
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'Banned IPs', url: '/dashboard/admin/ip' }
				]}
			>
				<BanIpDialog className="hidden md:inline-flex" />
				<BanIpDrawer className="md:hidden inline-flex" />
			</DashboardHeader>
			{children}
		</>
	);
}
