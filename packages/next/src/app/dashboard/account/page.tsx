import { DashboardHeader } from '~/components/DashboardHeader';
import { DashboardShell } from '~/components/DashboardShell';

export const metadata = {
	title: 'Dashboard - Credentials'
};

export default async function DashboardPage() {
	return (
		<DashboardShell>
			<DashboardHeader title="Credentials" subtitle="Manage your credentials" />
		</DashboardShell>
	);
}
