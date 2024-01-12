import { DashboardHeader } from '~/components/DashboardHeader';
import { DashboardShell } from '~/components/DashboardShell';

export const metadata = {
	title: 'Dashboard - Admin'
};

export default async function DashboardPage() {
	return (
		<DashboardShell>
			<DashboardHeader title="Settings" subtitle="Manage chibisafe settings" />
		</DashboardShell>
	);
}
