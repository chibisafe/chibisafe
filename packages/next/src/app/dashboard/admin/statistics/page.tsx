import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - Stats'
};

export default async function DashboardAdminStatsPage() {
	return (
		<>
			<DashboardHeader
				title="Statistics"
				subtitle="Your chibisafe instance stats"
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'Statistics', url: '/dashboard/admin/statistics' }
				]}
			/>
		</>
	);
}
