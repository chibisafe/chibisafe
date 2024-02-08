import { DashboardSidebar } from '@/components/DashboardSidebar';
import { SiteFooter } from '@/components/Footer';
import { Header } from '@/components/Header';

interface DashboardLayoutProps {
	children?: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<div className="flex min-h-screen flex-col space-y-6">
			<Header />
			<div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
				<aside className="hidden w-[200px] flex-col md:flex">
					<DashboardSidebar />
				</aside>
				<main className="flex w-full flex-1 flex-col overflow-hidden">
					<div className="grid items-start gap-8 pb-8">{children}</div>
				</main>
			</div>
			<SiteFooter className="border-t" />
		</div>
	);
}
