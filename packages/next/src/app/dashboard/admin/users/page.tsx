import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';

export const metadata: Metadata = {
	title: 'Dashboard - Admin'
};

export default async function DashboardPage() {
	return (
		<>
			<DashboardHeader title="Users" subtitle="Manage all users" />
		</>
	);
}
