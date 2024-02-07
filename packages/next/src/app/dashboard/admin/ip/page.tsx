import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/DashboardHeader';

export const metadata = {
	title: 'Dashboard - Admin'
};

export default async function DashboardPage() {
	return (
		<>
			<DashboardHeader title="Banned IPs" subtitle="Manage banned IPs">
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Ban new IP
				</Button>
			</DashboardHeader>
		</>
	);
}
