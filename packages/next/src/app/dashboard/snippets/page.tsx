import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Icons } from '@/components/icons';

export const metadata = {
	title: 'Dashboard - Snippets'
};

export default async function DashboardPage() {
	return (
		<>
			<DashboardHeader title="Snippets" subtitle="Manage and create snippets">
				<Button>
					<Icons.add className="mr-2 h-4 w-4" />
					New snippet
				</Button>
			</DashboardHeader>
		</>
	);
}
