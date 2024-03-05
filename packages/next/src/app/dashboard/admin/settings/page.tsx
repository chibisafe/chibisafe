import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - Settings'
};

export default async function DashboardAdminSettingsPage() {
	return (
		<>
			<DashboardHeader title="Settings" subtitle="Manage chibisafe settings" />
		</>
	);
}
