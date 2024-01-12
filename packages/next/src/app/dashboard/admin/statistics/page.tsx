import { DashboardHeader } from '~/components/DashboardHeader';
import { DashboardShell } from '~/components/DashboardShell';

export const metadata = {
	title: 'Dashboard - Admin'
};

export default async function DashboardPage() {
	return (
		<DashboardShell>
			<DashboardHeader title="Statistics" subtitle="Your chibisafe instance stats" />
		</DashboardShell>
	);
}
