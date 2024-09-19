import { DashboardHeader } from '@/components/DashboardHeader';
import type { PropsWithChildren } from 'react';

export default function LinksLayout({ children }: PropsWithChildren) {
	return (
		<>
			<DashboardHeader
				title="Short URLs"
				subtitle="Manage created short URLs"
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'All short URLs', url: '/dashboard/admin/links' }
				]}
			/>
			{children}
		</>
	);
}
