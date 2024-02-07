import { DashboardSidebar } from '@/components/DashboardSidebar';
import { SiteFooter } from '@/components/Footer';
// import { getCurrentUser } from '@/lib/session';
import { Navigation } from '@/components/Navigation';
import { NavigationUser } from '@/components/NavigationUser';

interface DashboardLayoutProps {
	children?: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<div className="flex min-h-screen flex-col space-y-6">
			<header className="sticky top-0 z-40 border-b bg-background">
				<div className="container flex h-16 items-center justify-between py-4">
					<Navigation />
					<NavigationUser />
				</div>
			</header>
			<div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
				<aside className="hidden w-[200px] flex-col md:flex">
					<DashboardSidebar />
				</aside>
				<main className="flex w-full flex-1 flex-col overflow-hidden">
					<div className="grid items-start gap-8">{children}</div>
				</main>
			</div>
			<SiteFooter className="border-t" />
		</div>
	);
}
