import type { PageQuery } from '@/types';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/DashboardHeader';
import { FilesList } from '@/components/FilesList';

export const metadata = {
	title: 'Dashboard - Uploads'
};

export default async function DashboardPage({ searchParams }: { searchParams: PageQuery }) {
	return (
		<>
			<DashboardHeader title="Uploads" subtitle="Manage your uploads">
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Upload file
				</Button>
			</DashboardHeader>
			<div className="px-2">
				<FilesList type="uploads" query={searchParams} />
			</div>
		</>
	);
}
