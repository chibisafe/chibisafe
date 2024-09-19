import { DashboardHeader } from '@/components/DashboardHeader';
import { CreateTagDialog } from '@/components/dialogs/CreateTagDialog';
import { CreateTagDrawer } from '@/components/drawers/CreateTagDrawer';
import type { PropsWithChildren } from 'react';

export default async function TagsLayout({ children }: PropsWithChildren) {
	return (
		<>
			<DashboardHeader title="Tags" subtitle="Manage and create tags">
				<CreateTagDialog className="hidden md:inline-flex" />
				<CreateTagDrawer className="inline-flex md:hidden" />
			</DashboardHeader>
			{children}
		</>
	);
}
