import { SiteFooter } from '@/components/Footer';
import { Header } from '@/components/Header';

interface MarketingLayoutProps {
	children: React.ReactNode;
}

export default async function MarketingLayout({ children }: MarketingLayoutProps) {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className="flex-1">{children}</main>
			<SiteFooter />
		</div>
	);
}
