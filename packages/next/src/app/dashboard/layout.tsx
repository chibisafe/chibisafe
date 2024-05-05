import type { PropsWithChildren } from 'react';

import { DashboardSidebar } from '@/components/DashboardSidebar';
import { SiteFooter } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog';

export default async function DashboardLayout({ children }: PropsWithChildren) {
	return (
		<div className="flex min-h-screen flex-col gap-6">
			<Header />
			<div className="container flex-1 flex gap-8 px-4 sm:px-8">
				<aside className="hidden min-w-[200px] flex-col md:flex">
					<DashboardSidebar />
				</aside>
				<main className="flex flex-col w-full">
					<div className="flex flex-col items-start gap-8">{children}</div>
				</main>
			</div>
			<SiteFooter className="border-t" />
			<ConfirmationDialog />
		</div>
	);
}
