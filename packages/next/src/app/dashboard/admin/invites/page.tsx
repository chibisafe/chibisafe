import { DashboardHeader } from '~/components/DashboardHeader';
import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';

export const metadata = {
	title: 'Dashboard - Admin'
};

export default async function DashboardPage() {
	return (
		<>
			<DashboardHeader title="Invites" subtitle="Manage and create new invites">
				<Button>
					<Icons.add className="mr-2 h-4 w-4" />
					New invite
				</Button>
			</DashboardHeader>
		</>
	);
}
