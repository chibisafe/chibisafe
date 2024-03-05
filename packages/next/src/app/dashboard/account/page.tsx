import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';

export const metadata: Metadata = {
	title: 'Dashboard - Credentials'
};

export default async function DashboardPage() {
	return (
		<>
			<DashboardHeader
				title="Credentials"
				subtitle="Manage your credentials"
				breadcrumbs={[{ name: 'Credentials', url: '/dashboard/account' }]}
			/>
		</>
	);
}
