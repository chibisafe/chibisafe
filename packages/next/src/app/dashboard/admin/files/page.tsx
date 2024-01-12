import { DashboardHeader } from '~/components/DashboardHeader';
import { DashboardShell } from '~/components/DashboardShell';

export const metadata = {
	title: 'Dashboard - Admin'
};

export default async function DashboardPage() {
	return (
		<DashboardShell>
			<DashboardHeader title="Files" subtitle="Manage all of chibisafe files" />
		</DashboardShell>
	);
}
