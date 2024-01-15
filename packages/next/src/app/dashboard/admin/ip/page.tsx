import { DashboardHeader } from '~/components/DashboardHeader';
import { DashboardShell } from '~/components/DashboardShell';
import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';

export const metadata = {
	title: 'Dashboard - Admin'
};

export default async function DashboardPage() {
	return (
		<DashboardShell>
			<DashboardHeader title="Banned IPs" subtitle="Manage banned IPs">
				<Button>
					<Icons.add className="mr-2 h-4 w-4" />
					Ban new IP
				</Button>
			</DashboardHeader>
		</DashboardShell>
	);
}
