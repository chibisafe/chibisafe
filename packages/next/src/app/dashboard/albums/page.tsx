import { DashboardHeader } from '~/components/DashboardHeader';
import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';

export const metadata = {
	title: 'Dashboard - Albums'
};

export default async function DashboardPage() {
	return (
		<>
			<DashboardHeader title="Albums" subtitle="Manage and create albums">
				<Button>
					<Icons.add className="mr-2 h-4 w-4" />
					New album
				</Button>
			</DashboardHeader>
		</>
	);
}
