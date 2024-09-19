import { DashboardHeader } from '@/components/DashboardHeader';
import { CreateShortUrlDialog } from '@/components/dialogs/CreateShortUrlDialog';
import { CreateShortUrlDrawer } from '@/components/drawers/CreateShortUrlDrawer';
import type { PropsWithChildren } from 'react';

export default async function LinksLayout({ children }: PropsWithChildren) {
	return (
		<>
			<DashboardHeader title="Short URLs" subtitle="Manage and create short URLs">
				<CreateShortUrlDialog className="hidden md:inline-flex" />
				<CreateShortUrlDrawer className="inline-flex md:hidden" />
			</DashboardHeader>
			{children}
		</>
	);
}
