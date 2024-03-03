import type { Metadata } from 'next';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/DashboardHeader';

export const metadata: Metadata = {
	title: 'Dashboard - Tags'
};

export default async function DashboardPage() {
	return (
		<>
			<DashboardHeader title="Tags" subtitle="Manage and create new tags">
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					New tag
				</Button>
			</DashboardHeader>
		</>
	);
}
