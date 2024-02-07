import { DashboardHeader } from '~/components/DashboardHeader';
import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';

export const metadata = {
	title: 'Dashboard - Tags'
};

export default async function DashboardPage() {
	return (
		<>
			<DashboardHeader title="Tags" subtitle="Manage and create new tags">
				<Button>
					<Icons.add className="mr-2 h-4 w-4" />
					New tag
				</Button>
			</DashboardHeader>
		</>
	);
}
