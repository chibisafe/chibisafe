import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/DashboardHeader';

export const metadata = {
	title: 'Dashboard - Albums'
};

export default async function DashboardPage() {
	return (
		<>
			<DashboardHeader title="Albums" subtitle="Manage and create albums">
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					New album
				</Button>
			</DashboardHeader>
		</>
	);
}
